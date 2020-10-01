import { Pool } from "pg";

import { Account } from "./accounts";

export interface Transaction {
  created_at: string;
  id: number;
  account_from_id: number;
  account_to_id: number;
  amount: number;
  explanation: string;
}

export interface TransactionDetails {
  created_at: string;
  id: number;
  account_from_id: number;
  account_to_id: number;
  user_from_id: number;
  user_from_name: number;
  user_to_id: number;
  user_to_name: number;
  amount: number;
  explanation: string;
}

export interface NewTransaction {
  user_id: number;
  account_from_id: number;
  account_to_id: number;
  amount: number;
  explanation: string;
}

export const create = async (
  pool: Pool,
  data: NewTransaction
): Promise<Transaction> => {
  const client = await pool.connect();

  try {
    await client.query("begin");

    const fromAccount: Account = (
      await client.query(
        "update accounts set balance = balance - $1 where id = $2 returning *",
        [data.amount, data.account_from_id]
      )
    ).rows[0];

    if (!fromAccount) throw { http: 404 };
    else if (Number(fromAccount.user_id) !== data.user_id) throw { http: 403 };
    else if (fromAccount.balance < 0)
      throw { http: 402, msg: "Insufficient funds" };

    const toAccount: Account = (
      await client.query(
        "update accounts set balance = balance + $1 where id = $2 returning *",
        [data.amount, data.account_to_id]
      )
    ).rows[0];

    if (!toAccount) throw { http: 404 };

    const transaction: Transaction = (
      await client.query(
        "insert into transactions (account_from_id, account_to_id, amount, explanation) values ($1, $2, $3, $4) returning *",
        [
          data.account_from_id,
          data.account_to_id,
          data.amount,
          data.explanation,
        ]
      )
    ).rows[0];

    await client.query("commit");

    return transaction;
  } catch (e) {
    await client.query("rollback");
    throw e;
  } finally {
    client.release();
  }
};

export const list = async (
  pool: Pool,
  user_id: number
): Promise<TransactionDetails[]> => {
  const transactionList: TransactionDetails[] = (
    await pool.query(
      `
        select * from (
          select from_user.*, users.id to_user_id, users.name to_user_name from (
            select transactions.*, users.id from_user_id, users.name from_user_name from
              transactions
            left join accounts on accounts.id = account_from_id
            left join users on accounts.user_id = users.id
          ) from_user
          left join accounts on accounts.id = account_from_id
          left join users on accounts.user_id = users.id
        ) to_user
        where from_user_id = $1 or to_user_id = $1
      `,
      [user_id]
    )
  ).rows;
  return transactionList;
};

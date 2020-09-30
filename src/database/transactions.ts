import { Pool } from "pg";

import { Account } from "./accounts";

export interface Transaction {
  id: number;
  from_id: number;
  to_id: number;
  amount: number;
  explanation: string;
}

export interface NewTransaction {
  user_id: number;
  from_id: number;
  to_id: number;
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
        [data.amount, data.from_id]
      )
    ).rows[0];

    if (!fromAccount) throw { http: 404 };
    else if (Number(fromAccount.user_id) !== data.user_id) throw { http: 403 };
    else if (fromAccount.balance < 0)
      throw { http: 402, msg: "Insufficient funds" };

    const toAccount: Account = (
      await client.query(
        "update accounts set balance = balance + $1 where id = $2 returning *",
        [data.amount, data.to_id]
      )
    ).rows[0];

    if (!toAccount) throw { http: 404 };

    const transaction: Transaction = (
      await client.query(
        "insert into transactions (from_id, to_id, amount, explanation) values ($1, $2, $3, $4) returning *",
        [data.from_id, data.to_id, data.amount, data.explanation]
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
): Promise<Transaction[]> => {
  const transactionList: Transaction[] = (
    await pool.query(
      "select transactions.* from transactions left join accounts on accounts.id = from_id or accounts.id = to_id where accounts.user_id = $1",
      [user_id]
    )
  ).rows;
  return transactionList;
};

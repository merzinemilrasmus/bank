import { Pool } from "pg";
import { Account } from "./accounts";
import { ACCOUNT_PREFIX } from "../constants";

export enum TransactionStatus {
  Pending = "pending",
  Success = "success",
  Failed = "failed",
}

export interface Transaction {
  created_at: string;
  id: number;
  account_from_prefix: string;
  account_from_id: number;
  account_to_prefix: string;
  account_to_id: number;
  amount: number;
  explanation: string;
  status: TransactionStatus;
}

export interface TransactionDetails {
  created_at: string;
  id: number;
  account_from_prefix: string;
  account_from_id: number;
  account_to_prefix: string;
  account_to_id: number;
  user_from_id: number;
  user_from_name: number;
  user_to_id: number;
  user_to_name: number;
  amount: number;
  explanation: string;
  status: TransactionStatus;
}

export interface NewTransaction {
  userId: number;
  accountFrom: string;
  accountTo: string;
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

    const accountFromPrefix = data.accountFrom.substring(0, 3);
    const accountToPrefix = data.accountTo.substring(0, 3);

    const accountFromId = data.accountFrom.substring(3);
    const accountToId = data.accountTo.substring(3);

    if (accountFromPrefix !== ACCOUNT_PREFIX)
      throw { http: 404, msg: "Sender account does not exist." };

    const fromAccount: Account = (
      await client.query(
        "update accounts set balance = balance - $1 where id = $2 returning *",
        [data.amount, accountFromId]
      )
    ).rows[0];

    if (!fromAccount)
      throw { http: 404, msg: "Sender account does not exist." };
    else if (Number(fromAccount.user_id) !== data.userId) throw { http: 403 };
    else if (fromAccount.balance < 0)
      throw { http: 402, msg: "Insufficient funds." };

    if (accountToPrefix === ACCOUNT_PREFIX) {
      const toAccount: Account = (
        await client.query(
          "update accounts set balance = balance + $1 where id = $2 returning *",
          [data.amount, accountToId]
        )
      ).rows[0];

      if (!toAccount)
        throw { http: 404, msg: "Beneficiary account does not exist." };

      const transaction: Transaction = (
        await client.query(
          `insert into transactions (
            account_from_prefix,
            account_from_id,
            account_to_prefix,
            account_to_id,
            amount,
            explanation,
            status
          ) values ($1, $2, $3, $4, $5, $6, $7) returning *`,
          [
            accountFromPrefix,
            accountFromId,
            accountToPrefix,
            accountToId,
            data.amount,
            data.explanation,
            TransactionStatus.Success,
          ]
        )
      ).rows[0];

      await client.query("commit");

      return transaction;
    } else {
      const transaction: Transaction = (
        await client.query(
          `insert into transactions (
            account_from_prefix,
            account_from_id,
            account_to_prefix,
            account_to_id,
            amount,
            explanation,
            status
          ) values ($1, $2, $3, $4, $5, $6, $7) returning *`,
          [
            accountFromPrefix,
            accountFromId,
            accountToPrefix,
            accountToId,
            data.amount,
            data.explanation,
            TransactionStatus.Pending,
          ]
        )
      ).rows[0];

      await client.query("commit");

      return transaction;
    }

    throw {};
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
          select user_from.*, users.id user_to_id, users.name user_to_name from (
            select transactions.*, users.id user_from_id, users.name user_from_name from
              transactions
            left join accounts on account_from_prefix = $2 and accounts.id::text = account_from_id
            left join users on accounts.user_id = users.id
          ) user_from
          left join accounts on account_to_prefix = $2 and accounts.id::text = account_to_id
          left join users on accounts.user_id = users.id
        ) user_to
        where
          (user_from_id = $1 and account_from_prefix = $2) or
          (user_to_id = $1 and account_to_prefix = $2)
      `,
      [user_id, ACCOUNT_PREFIX]
    )
  ).rows;
  return transactionList;
};

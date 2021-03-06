import { Pool } from "pg";
import * as bcrypt from "bcrypt";

import { Account } from "./accounts";

export interface User {
  id: number;
  name: string;
  username: string;
  password_hash: string;
}

export interface NewUser {
  name: string;
  username: string;
  password: string;
}

export interface UserProfile {
  name: string;
  username: string;
  accounts: {
    id: number;
    name: string;
    balance: number;
  }[];
}

export interface Login {
  username: string;
  password: string;
}

export const create = async (
  pool: Pool,
  data: NewUser
): Promise<UserProfile> => {
  const hash = await bcrypt.hash(data.password, 10);
  const client = await pool.connect();

  try {
    await client.query("begin");

    const user: User = (
      await client.query(
        "insert into users (name, username, password_hash) values ($1, $2, $3) returning *",
        [data.name, data.username, hash]
      )
    ).rows[0];
    const account: Account = (
      await client.query(
        "insert into accounts (user_id, name) values ($1, $2) returning *",
        [user.id, "Main"]
      )
    ).rows[0];

    await client.query("commit");

    return {
      name: user.name,
      username: user.username,
      accounts: [
        {
          id: account.id,
          name: account.name,
          balance: account.balance,
        },
      ],
    };
  } catch (e) {
    await client.query("rollback");
    switch (Number(e.code)) {
      case 23505:
        throw { http: 409 };
      default:
        throw e;
    }
    throw e;
  } finally {
    client.release();
  }
};

export const verify = async (pool: Pool, data: Login): Promise<User> => {
  const user: User | undefined = (
    await pool.query("select * from users where username = $1 limit 1", [
      data.username,
    ])
  ).rows[0];
  if (user && (await bcrypt.compare(data.password, user.password_hash)))
    return user;
  else throw { http: 401 };
};

export const profile = async (pool: Pool, id: number): Promise<UserProfile> => {
  const user: User = (
    await pool.query("select * from users where id = $1 limit 1", [id])
  ).rows[0];
  const accounts: Account[] = (
    await pool.query("select * from accounts where user_id = $1", [id])
  ).rows;
  return {
    name: user.name,
    username: user.username,
    accounts: accounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      balance: acc.balance,
    })),
  };
};

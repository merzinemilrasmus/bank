import { Pool } from "pg";
import * as bcrypt from "bcrypt";

export interface User {
  id: number;
  name: string;
  username: string;
  passwordHash: string;
}

export interface NewUser {
  name: string;
  username: string;
  password: string;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  balance: number;
}

export interface NewAccount {
  user_id: number;
  name: string;
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
    throw e;
  } finally {
    client.release();
  }
};

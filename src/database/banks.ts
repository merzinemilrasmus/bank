import { Pool } from "pg";

export interface Bank {
  id: number;
  name: string;
  transaction_url: string;
  bank_prefix: string;
  owners: string;
  jwks_url: string;
}

export interface NewBank {
  name: string;
  transactionUrl: string;
  bankPrefix: string;
  owners: string;
  jwksUrl: string;
}

export const updateBanksList = (pool: Pool, data: NewBank[]) => {};

# PANK API

## Environment Variables

Environment variables can be stored in `.env` file in the project root.
Defaults are in [`src/constants.ts`](src/constants.ts).

#### HOST

Web server hostname; default: `HOST=localhost`.

#### PORT

Web server port; default: `PORT=3000`.

#### DATABASE_URL

Database resource location; default: `DATABASE_URL=postgres://localhost`.

#### PRIVATE_KEY

Private server key for signing.

#### TOKEN_LIFETIME

Session token lifetime; default: `TOKEN_LIFETIME=3600`.

#### ACCOUNT_PREFIX

Session token lifetime; default: `ACCOUNT_PREFIX=ERM`.

## Interface

#### Register

```
POST /users {
  name: string;
  username: string;
  password: string;
} -> [
  201: {
    id: number;
    name: string;
    username: string;
    accounts: {
      id: number;
      name: string;
      balance: number;
    }[];
  };
  400: {
    errors: {
      msg: string;
      param: string;
      location: string;
    }[];
  };
  409;
]
```

#### Login

```
POST /sessions {
  username: string;
  password: string;
} -> [
  200: {
    jwt: string;
  };
  400: {
    errors: {
      msg: string;
      param: string;
      location: string;
    }[];
  };
  401;
]
```

#### Profile

```
GET /users
GET /users/:id (
  Authorization: <jwt>
) -> [
  200: {
    name: string;
    username: string;
    accounts: {
      id: number;
      name: string;
      balance: number;
    }[];
  };
  400: {
    errors: {
      msg: string;
      param: string;
      location: string;
    }[];
  };
  401;
  403;
]
```

#### Transfer

```
POST /transactions (
  Authorization: <jwt>
) {
  accountFrom: number;
  accountTo: number;
  amount: number;
  currency: string;
  explanation: string;
} -> {
  201: {
    created_at: string;
    id: number;
    account_from_id: number;
    account_to_id: number;
    amount: number;
    explanation: string;
  };
  202: {
    created_at: string;
    id: number;
    account_from_id: number;
    account_to_id: number;
    amount: number;
    explanation: string;
  };
  400: {
    errors: {
      msg: string;
      param: string;
      location: string;
    }[];
  };
  401;
  402: {
    error: string;
  };
  403;
  404: {
    error: string;
  };
  501;
}
```

#### Transaction Log

```
GET /transactions (
  Authorization: <jwt>
) -> {
  200: {
    transactions: {
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
    }[];
  };
  401;
}
```

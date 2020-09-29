# PANK API

## Environment Variables

Environment variables can be stored in `.env` file in the project root.

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

## Interface

#### Register

```
POST /users {
  name: string;
  username: string;
  password: string;
} -> [
  201: {
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

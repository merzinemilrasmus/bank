# PANK API

## Environment Variables

Environment variables can be stored in `.env` file in the project root.

#### HOST

Web server hostname; default: `HOST=localhost`.

#### PORT

Web server port; default: `PORT=3000`.

#### DATABASE_URL

Database resource location; default: `DATABASE_URL=postgres://localhost`.

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

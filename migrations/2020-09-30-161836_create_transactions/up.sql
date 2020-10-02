create type transaction_status as enum ('pending', 'success', 'failed');

create table transactions (
  created_at timestamptz not null default now(),
  id bigint primary key generated always as identity,
  account_from_id bigint references accounts,
  account_to_id bigint references accounts,
  amount bigint not null,
  explanation varchar(128) not null,
  status transaction_status not null default 'pending',

  check (amount > 0),
  check (account_from_id != account_to_id)
);

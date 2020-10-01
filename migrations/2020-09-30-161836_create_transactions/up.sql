create table transactions (
  created_at timestamptz not null default now(),
  id bigint primary key generated always as identity,
  account_from_id bigint references accounts,
  account_to_id bigint references accounts,
  amount bigint not null,
  explanation varchar(128) not null,

  check (amount > 0),
  check (account_from_id != account_to_id)
);

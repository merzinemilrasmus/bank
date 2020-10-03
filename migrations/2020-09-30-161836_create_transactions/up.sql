create type transaction_status as enum ('pending', 'success', 'failed');

create table transactions (
  created_at timestamptz not null default now(),
  id bigint primary key generated always as identity,

  account_from_prefix char(3) not null,
  account_from_id varchar(61) not null,
  account_to_prefix char(3) not null,
  account_to_id varchar(61) not null,

  amount bigint not null,
  explanation varchar(128) not null,
  status transaction_status not null,

  check (amount > 0),
  check (account_from_id != account_to_id)
);

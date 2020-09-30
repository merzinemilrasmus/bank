create table transactions (
  id bigint primary key generated always as identity,
  from_id bigint references accounts,
  to_id bigint references accounts,
  amount bigint not null,
  explanation varchar(128) not null,

  check (amount > 0),
  check (from_id != to_id)
);

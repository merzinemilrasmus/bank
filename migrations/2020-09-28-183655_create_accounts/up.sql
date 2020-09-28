create table accounts (
  id bigint primary key generated always as identity,
  user_id bigint references users,
  name varchar(64) not null,
  balance bigint default 0,

  check (name !~ '^\s*$')
);

create unique index accounts_name_unique on accounts (user_id, upper(name));

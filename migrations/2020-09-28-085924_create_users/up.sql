create table users (
  id bigint primary key generated always as identity,
  name varchar(64) not null,
  username varchar(64) not null,
  password_hash char(60) not null,

  check (name !~ '^\s*$'),
  check (username !~ '\s'),
  check (length(username) > 0),
  check (length(password_hash) = 60)
);

create unique index users_username_unique on users (upper(name));

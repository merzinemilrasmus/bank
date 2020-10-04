create table banks (
  id bigint primary key generated always as identity,
  name varchar(128) not null,
  transaction_url varchar(512) not null,
  bank_prefix char(3) not null,
  owners varchar(128) not null,
  jwks_url varchar(512) not null
);

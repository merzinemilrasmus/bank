#!/bin/sh

# shellcheck source=../.env
. "$(dirname "$(readlink -f "$0")")/../.env"
[ -z "$HOST" ] && HOST=localhost
[ -z "$PORT" ] && PORT=3000

printf 'jwt: '
read -r jwt
printf 'accountFrom: '
read -r account_from
printf 'accountTo: '
read -r account_to
printf 'amount: '
read -r amount
printf 'currency (USD): '
read -r currency
[ -z "$currency" ] && currency=USD
printf 'explanation: '
read -r explanation

query="curl -i http://$HOST:$PORT/transactions
  -H 'Content-Type: application/json'
  -H 'Authorization: $jwt'
  -d '{
    \"accountFrom\":\"$account_from\",
    \"accountTo\":\"$account_to\",
    \"amount\":\"$amount\",
    \"currency\":\"$currency\",
    \"explanation\":\"$explanation\"
  }'"

echo "> $query"
eval "$(echo "$query" | paste -sd ' ')"

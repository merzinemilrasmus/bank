#!/bin/sh

dir=$(dirname "$(readlink -f "$0")")

# shellcheck source=format.sh
. "$dir/format.sh"
# shellcheck source=../.env
. "$dir/../.env"

[ -z "$HOST" ] && HOST=localhost
[ -z "$PORT" ] && PORT=3000

printf 'jwt: ' >&2
read -r jwt
printf 'accountFrom: ' >&2
read -r account_from
printf 'accountTo: ' >&2
read -r account_to
printf 'amount: ' >&2
read -r amount
printf 'currency (USD): ' >&2
read -r currency
[ -z "$currency" ] && currency=USD
printf 'explanation: ' >&2
read -r explanation

query="curl http://$HOST:$PORT/transactions
  -H 'Content-Type: application/json'
  -H 'Authorization: $jwt'
  -d '{
    \"accountFrom\":\"$account_from\",
    \"accountTo\":\"$account_to\",
    \"amount\":\"$amount\",
    \"currency\":\"$currency\",
    \"explanation\":\"$explanation\"
  }'"

echo "> $query" >&2
format "$(eval "$(echo "$query" | paste -sd ' ')")"

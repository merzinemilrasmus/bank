#!/bin/sh

# shellcheck source=../.env
. "$(dirname "$(readlink -f "$0")")/../.env"
[ -z "$HOST" ] && HOST=localhost
[ -z "$PORT" ] && PORT=3000

printf 'jwt: '
read -r jwt

query="curl -i http://$HOST:$PORT/users
  -H 'Authorization: $jwt'"

echo "> $query"
eval "$(echo "$query" | paste -sd ' ')"

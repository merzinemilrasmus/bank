#!/bin/sh

# shellcheck source=../.env
. "$(dirname "$(readlink -f "$0")")/../.env"
[ -z "$HOST" ] && HOST=localhost
[ -z "$PORT" ] && PORT=3000

printf 'username: '
read -r username
printf 'password: '
read -r password

query="curl -i http://$HOST:$PORT/sessions
  -H 'Content-Type: application/json'
  -d '{
    \"username\":\"$username\",
    \"password\":\"$password\"
  }'"

echo "> $query"
eval "$(echo "$query" | paste -sd ' ')"

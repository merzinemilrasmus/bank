#!/bin/sh

# shellcheck source=../.env
. "$(dirname "$(readlink -f "$0")")/../.env"
[ -z "$HOST" ] && HOST=localhost
[ -z "$PORT" ] && PORT=3000

printf 'name: '
read -r name
printf 'username: '
read -r username
printf 'password: '
read -r password

query="curl -i http://$HOST:$PORT/users
  -H 'Content-Type: application/json'
  -d '{
    \"name\":\"$name\",
    \"username\":\"$username\",
    \"password\":\"$password\"
  }'"

echo "> $query"
eval "$(echo "$query" | paste -sd ' ')"

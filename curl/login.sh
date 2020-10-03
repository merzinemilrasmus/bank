#!/bin/sh

dir=$(dirname "$(readlink -f "$0")")

# shellcheck source=format.sh
. "$dir/format.sh"
# shellcheck source=../.env
. "$dir/../.env"

[ -z "$HOST" ] && HOST=localhost
[ -z "$PORT" ] && PORT=3000

printf 'username: ' >&2
read -r username
printf 'password: ' >&2
read -r password

query="curl http://$HOST:$PORT/sessions
  -H 'Content-Type: application/json'
  -d '{
    \"username\":\"$username\",
    \"password\":\"$password\"
  }'"

echo "> $query" >&2
format "$(eval "$(echo "$query" | paste -sd ' ')")"

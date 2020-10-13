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

query="curl http://$HOST:$PORT/b2b
  -H 'Content-Type: application/json'
  -d '{
    \"jwt\":\"$jwt\"
  }'"

echo "> $query" >&2
format "$(eval "$(echo "$query" | paste -sd ' ')")"

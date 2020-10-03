format() {
  printf 'format: ' >&2
  read -r format

  if [ -n "$format" ]
  then node -e 'console.log(
    JSON.stringify(JSON.parse(`'"$1"'`), null, 2)
  )'
  else echo "$1"
  fi
}

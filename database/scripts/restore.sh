#!/usr/bin/env sh
set -eu
: "${MONGODB_URI:?Set MONGODB_URI}"
test -n "${1:-}"
mongorestore --uri="$MONGODB_URI" --drop "$1"

#!/usr/bin/env sh
set -eu
: "${MONGODB_URI:?Set MONGODB_URI}"
mongodump --uri="$MONGODB_URI" --out="${1:-./backup}"

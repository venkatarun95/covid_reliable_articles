#!/bin/bash

export TYPESENSE_API_KEY=xyz
TYPESENSE_DIR=/home/venkatar/Software/typesense
mkdir /tmp/typesense-data
$TYPESENSE_DIR/typesense-server --data-dir=/tmp/typesense-data --api-key=$TYPESENSE_API_KEY

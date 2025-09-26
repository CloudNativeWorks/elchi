#!/bin/bash

# Check for necessary dependencies
for dep in git yarn wget tar buf node npm yq; do
    if ! command -v $dep &> /dev/null; then
        echo "Dependency not found: $dep"
        exit 1
    fi
done

# Save the directory where the script is running
SCRIPT_DIR=$(cd $(dirname $0); pwd)

# Define the root directory of our project - two levels up
ROOT_DIR=$(dirname $(dirname $SCRIPT_DIR))

# Take the Envoy version as an argument
ENVOY_VERSION=$1

# If the Envoy version is not specified, output an error message and exit
if [ -z "$ENVOY_VERSION" ]; then
    echo "Envoy version not specified. Usage: $0 <envoy_version>"
    exit 1
fi

# Create a temporary directory for ts-proto installation
TMP_TS_PROTO_DIR=$(mktemp -d)
cd $TMP_TS_PROTO_DIR
git clone --depth 1 --branch v2.2.3 https://github.com/stephenh/ts-proto.git
cd ts-proto

# Install dependencies with Yarn
yarn install

# Build with Yarn
yarn build

# Check if protoc-gen-ts_proto is available
# PROTOC_GEN_TS_PATH="$TMP_TS_PROTO_DIR/ts-proto/node_modules/.bin/protoc-gen-ts_proto"
PROTOC_GEN_TS_PATH="$SCRIPT_DIR/ts-proto-debug.sh"

echo $PROTOC_GEN_TS_PATH
if [ ! -f "$PROTOC_GEN_TS_PATH" ]; then
    echo "protoc-gen-ts_proto not found: $PROTOC_GEN_TS_PATH"
    exit 1
fi

# export PROTOC_GEN_TS_PATH="$TMP_TS_PROTO_DIR/ts-proto/node_modules/.bin/protoc-gen-ts_proto"
export PROTOC_GEN_TS_PATH="$SCRIPT_DIR/ts-proto-debug.sh"
yq e -i '.plugins[].path = strenv(PROTOC_GEN_TS_PATH)' $SCRIPT_DIR/buf.gen.yaml


# Download Envoy
ENVY_ARCHIVE=v$ENVOY_VERSION.tar.gz
wget https://github.com/envoyproxy/envoy/archive/refs/tags/$ENVY_ARCHIVE -P $ROOT_DIR

# Extract the archive
tar -xvf $ROOT_DIR/$ENVY_ARCHIVE -C $ROOT_DIR

# Navigate to the relevant directory
cd $ROOT_DIR/envoy-$ENVOY_VERSION/api

# Copy the buf.gen.yaml file
BUF_GEN_FILE="$SCRIPT_DIR/buf.gen.yaml"
DEST_BUF_GEN_FILE="$ROOT_DIR/envoy-$ENVOY_VERSION/api/buf.gen.yaml"

if [ -f "$BUF_GEN_FILE" ]; then
    cp "$BUF_GEN_FILE" "$DEST_BUF_GEN_FILE"
else
    echo "buf.gen.yaml not found: $BUF_GEN_FILE"
    exit 1
fi

# Run buf generate
buf generate

# Return to the project directory
cd ../../..

# Create a target directory for the generated models
VERSIONS_DIR=$ROOT_DIR/src/elchi/versions/v$ENVOY_VERSION
mkdir -p $VERSIONS_DIR/models

# Copy the generated models to the target directory
cp -r $ROOT_DIR/envoy-$ENVOY_VERSION/api/models/* $VERSIONS_DIR/models

# Clean up the models directory
rm -rf $ROOT_DIR/envoy-$ENVOY_VERSION/api/models

# Run the readFields npm script
(cd $ROOT_DIR && npm run readNewFields -- v$ENVOY_VERSION)

# Replace the newly placed duration.ts with custom_duration.ts
CUSTOM_DURATION_FILE="$SCRIPT_DIR/custom_duration.ts"
NEW_DURATION_FILE="$VERSIONS_DIR/models/google/protobuf/duration.ts"

if [ -f "$CUSTOM_DURATION_FILE" ]; then
    cp "$CUSTOM_DURATION_FILE" "$NEW_DURATION_FILE"
else
    echo "Custom duration file not found: $CUSTOM_DURATION_FILE"
    exit 1
fi

# Delete the downloaded archive and the extracted Envoy repository
rm -rf $ROOT_DIR/$ENVY_ARCHIVE $ROOT_DIR/envoy-$ENVOY_VERSION $TMP_TS_PROTO_DIR

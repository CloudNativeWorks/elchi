#!/bin/bash

cleanup() {
    echo "Cleaning up..."
    if [ ! -z "$SERVER_PID" ] ; then
        kill $SERVER_PID
    fi
    if [ ! -z "$PROXY_PID" ] ; then
        kill $PROXY_PID
    fi
    rm -rf dist/
    exit 0
}

trap cleanup SIGINT SIGTERM

export NODE_OPTIONS="--max-old-space-size=8192"
export NODE_ENV="production"

rm -rf dist/

echo "Starting production build..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    cleanup
    exit 1
fi

echo "Installing serve package..."
npm install -g serve

echo "Starting production server with Nginx-like setup..."
npx local-ssl-proxy --source 443 --target 3000 --cert localhost.pem --key localhost-key.pem &
PROXY_PID=$!

serve -s dist -l 3000 &
SERVER_PID=$!

echo "Production server running at https://localhost"
echo "Press Ctrl+C to stop"

wait $SERVER_PID

cleanup
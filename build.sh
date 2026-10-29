#!/bin/bash
# This script builds the frontend application(s).

# Clear the public directory
rm -rf public/*

# Build Preact app if it exists
if [ -d "preact-app" ]; then
  echo "Building Preact app..."
  (cd preact-app && npm install && npm run build)
  echo "Preact build complete. The output is in the 'public' directory."
fi

# Build Flutter app if it exists
if [ -d "flutter_app" ]; then
  echo "Building Flutter app..."
  (cd flutter_app && flutter build web)
  # Copy the Flutter web build to the public directory
  cp -r flutter_app/build/web/* public/
  echo "Flutter build complete. The output has been copied to the 'public' directory."
fi

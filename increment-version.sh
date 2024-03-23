#!/bin/bash

# Read the current version number from the file
VERSION=$(cat version.txt)

# Increment the version number
IFS='.' read -ra PARTS <<< "$VERSION"
MAJOR=${PARTS[0]}
MINOR=${PARTS[1]}

# Increment the minor version number
NEW_MINOR=$((MINOR + 1))

# Combine the major and minor parts into a new version number
NEW_VERSION="$MAJOR.$NEW_MINOR"

# Write the new version number back to the file
echo $NEW_VERSION > version.txt

# Print the new version number
echo "New version number: $NEW_VERSION"
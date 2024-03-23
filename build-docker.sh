echo "Building Chi Country Facts..."
source ./increment-version.sh

if [ "$1" = "arm" ]; then
  echo "Building for ARM..."
  docker buildx build --build-arg NODE_ENV=production --platform linux/arm64 -t chi-country-facts .
else
  echo "Building for Intel..."
  docker build --build-arg NODE_ENV=production -t chi-country-facts .
fi


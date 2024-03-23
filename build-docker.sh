echo "Building Ríoverse Marketing..."
source ./increment-version.sh

if [ "$1" = "arm" ]; then
  echo "Building for ARM..."
  docker buildx build --build-arg NODE_ENV=production --platform linux/arm64 -t rioverse-marketing .
else
  echo "Building for Intel..."
  docker build --build-arg NODE_ENV=production -t rioverse-marketing .
fi


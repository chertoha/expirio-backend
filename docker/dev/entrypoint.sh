#!/bin/sh

echo "Applying Prisma migrations (deploy)..."
if ! npx prisma migrate deploy; then
  printf '\033[0;31m%s\033[0m\n' "Warning: prisma migrate deploy failed. Continuing startup without applied migrations."
fi

echo "Running Prisma seed..."
if ! npx prisma db seed; then
  printf '\033[0;31m%s\033[0m\n' "Warning: prisma db seed failed. Continuing startup without seeded data."
fi

# launch the main application
yarn start:prod

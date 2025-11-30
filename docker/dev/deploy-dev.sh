#!/bin/bash

set -e

echo "=============================================="
echo "��� Starting SAFE REDEPLOY for DEV environment"
echo "=============================================="

PROJECT_DIR="/home/ubuntu/projects/dev"
COMPOSE_FILE="docker-compose.dev.yml"
BRANCH="dev"
LOG_FILE="/home/ubuntu/deploy-dev.log"

echo "��� Moving to project directory: $PROJECT_DIR"
cd $PROJECT_DIR

echo "��� Fetching latest changes from $BRANCH..."
git fetch origin
git reset --hard origin/$BRANCH

echo "��� Stopping running containers..."
docker compose -f $COMPOSE_FILE down --remove-orphans > $LOG_FILE 2>&1

echo "��� Cleaning unused Docker resources (but KEEPING volumes)..."  
docker system prune -af >> $LOG_FILE 2>&1

echo "��� Building and starting containers..."
docker compose -f $COMPOSE_FILE up --build -d >> $LOG_FILE 2>&1       

echo "��� Listing running containers..."
docker ps

echo "=============================================="
echo "✅ SAFE REDEPLOY FINISHED SUCCESSFULLY!"
echo "=============================================="
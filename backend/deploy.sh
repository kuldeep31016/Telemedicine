#!/bin/bash

# Simple AWS Backend Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting deployment to AWS..."

# Configuration
AWS_HOST="43.205.255.144"
AWS_USER="ubuntu"  # Change this to your AWS user (ubuntu/ec2-user)
REMOTE_DIR="/home/ubuntu/telemedicine/backend"  # Change to your actual path

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Step 1: Syncing files to AWS...${NC}"
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude 'uploads' \
  --exclude 'logs' \
  --exclude '.env' \
  --exclude '.git' \
  ./ ${AWS_USER}@${AWS_HOST}:${REMOTE_DIR}/

echo -e "${YELLOW}📦 Step 2: Installing dependencies on AWS...${NC}"
ssh ${AWS_USER}@${AWS_HOST} "cd ${REMOTE_DIR} && npm install --production"

echo -e "${YELLOW}🔄 Step 3: Restarting backend service...${NC}"
ssh ${AWS_USER}@${AWS_HOST} "cd ${REMOTE_DIR} && pm2 restart telemedicine-backend || pm2 start server.js --name telemedicine-backend"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Backend URL: https://api.kuldeepraj.xyz${NC}"

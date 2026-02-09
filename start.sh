#!/bin/bash

# Telemedicine Platform Quick Start Script
# This script helps you set up and run the complete platform

echo "🏥 Telemedicine Platform - Quick Start"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env files exist
check_env_files() {
    echo "${BLUE}📋 Checking environment files...${NC}"
    
    BACKEND_ENV="/Users/kuldeepraj/Desktop/SIH/Telemedicine/backend/.env"
    FRONTEND_ENV="/Users/kuldeepraj/Desktop/SIH/Telemedicine/web-react/.env"
    
    if [ ! -f "$BACKEND_ENV" ]; then
        echo "${RED}❌ Backend .env file not found!${NC}"
        echo "Creating from template..."
        cp "$BACKEND_ENV.example" "$BACKEND_ENV"
        echo "${YELLOW}⚠️  Please fill in backend/.env with your Firebase credentials${NC}"
        exit 1
    fi
    
    if [ ! -f "$FRONTEND_ENV" ]; then
        echo "${RED}❌ Frontend .env file not found!${NC}"
        echo "Creating from template..."
        cp "$FRONTEND_ENV.example" "$FRONTEND_ENV"
        echo "${YELLOW}⚠️  Please fill in web-react/.env with your Firebase credentials${NC}"
        exit 1
    fi
    
    echo "${GREEN}✅ Environment files found!${NC}"
}

# Check if Firebase credentials are filled
check_firebase_config() {
    echo ""
    echo "${BLUE}🔥 Checking Firebase configuration...${NC}"
    
    # Check backend
    if grep -q "your-project-id" "$BACKEND_ENV" 2>/dev/null; then
        echo "${YELLOW}⚠️  Backend Firebase credentials not filled!${NC}"
        echo "Please edit: backend/.env"
        exit 1
    fi
    
    # Check frontend
    if grep -q "your-api-key" "$FRONTEND_ENV" 2>/dev/null; then
        echo "${YELLOW}⚠️  Frontend Firebase credentials not filled!${NC}"
        echo "Please edit: web-react/.env"
        exit 1
    fi
    
    echo "${GREEN}✅ Firebase configured!${NC}"
}

# Install dependencies
install_dependencies() {
    echo ""
    echo "${BLUE}📦 Installing dependencies...${NC}"
    
    # Backend
    echo "Installing backend dependencies..."
    cd /Users/kuldeepraj/Desktop/SIH/Telemedicine/backend
    npm install
    
    # Frontend
    echo "Installing frontend dependencies..."
    cd /Users/kuldeepraj/Desktop/SIH/Telemedicine/web-react
    npm install
    
    echo "${GREEN}✅ Dependencies installed!${NC}"
}

# Main menu
show_menu() {
    echo ""
    echo "${BLUE}Choose an option:${NC}"
    echo "1. Start Backend Server (http://localhost:5000)"
    echo "2. Start Frontend App (http://localhost:3000)"
    echo "3. Start Both (Recommended)"
    echo "4. Check Setup Status"
    echo "5. Exit"
    echo ""
    read -p "Enter your choice [1-5]: " choice
    
    case $choice in
        1)
            start_backend
            ;;
        2)
            start_frontend
            ;;
        3)
            start_both
            ;;
        4)
            check_setup
            ;;
        5)
            echo "${GREEN}Goodbye! 👋${NC}"
            exit 0
            ;;
        *)
            echo "${RED}Invalid option!${NC}"
            show_menu
            ;;
    esac
}

# Start backend
start_backend() {
    echo ""
    echo "${GREEN}🚀 Starting Backend Server...${NC}"
    cd /Users/kuldeepraj/Desktop/SIH/Telemedicine/backend
    npm run dev
}

# Start frontend
start_frontend() {
    echo ""
    echo "${GREEN}🚀 Starting Frontend App...${NC}"
    cd /Users/kuldeepraj/Desktop/SIH/Telemedicine/web-react
    npm start
}

# Start both
start_both() {
    echo ""
    echo "${GREEN}🚀 Starting Backend & Frontend...${NC}"
    echo ""
    echo "${YELLOW}Opening two terminal windows...${NC}"
    echo ""
    
    # macOS specific - open new terminal tabs
    osascript -e 'tell application "Terminal" to do script "cd /Users/kuldeepraj/Desktop/SIH/Telemedicine/backend && npm run dev"'
    sleep 2
    osascript -e 'tell application "Terminal" to do script "cd /Users/kuldeepraj/Desktop/SIH/Telemedicine/web-react && npm start"'
    
    echo "${GREEN}✅ Both servers starting in new terminal tabs!${NC}"
    echo ""
    echo "Backend: http://localhost:5000"
    echo "Frontend: http://localhost:3000"
    echo ""
}

# Check setup status
check_setup() {
    echo ""
    echo "${BLUE}📊 Setup Status Check${NC}"
    echo "===================="
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        echo "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
    else
        echo "${RED}❌ Node.js not installed${NC}"
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        echo "${GREEN}✅ npm: $NPM_VERSION${NC}"
    else
        echo "${RED}❌ npm not installed${NC}"
    fi
    
    # Check MongoDB
    if command -v mongod &> /dev/null; then
        echo "${GREEN}✅ MongoDB installed${NC}"
    else
        echo "${YELLOW}⚠️  MongoDB not found (optional if using cloud)${NC}"
    fi
    
    # Check backend dependencies
    if [ -d "/Users/kuldeepraj/Desktop/SIH/Telemedicine/backend/node_modules" ]; then
        echo "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo "${RED}❌ Backend dependencies not installed${NC}"
    fi
    
    # Check frontend dependencies
    if [ -d "/Users/kuldeepraj/Desktop/SIH/Telemedicine/web-react/node_modules" ]; then
        echo "${GREEN}✅ Frontend dependencies installed${NC}"
    else
        echo "${RED}❌ Frontend dependencies not installed${NC}"
    fi
    
    echo ""
    show_menu
}

# Main execution
main() {
    check_env_files
    check_firebase_config
    
    # Ask if dependencies need to be installed
    if [ ! -d "/Users/kuldeepraj/Desktop/SIH/Telemedicine/backend/node_modules" ] || [ ! -d "/Users/kuldeepraj/Desktop/SIH/Telemedicine/web-react/node_modules" ]; then
        echo ""
        read -p "Dependencies not installed. Install now? (y/n): " install
        if [ "$install" == "y" ] || [ "$install" == "Y" ]; then
            install_dependencies
        fi
    fi
    
    show_menu
}

# Run main function
main

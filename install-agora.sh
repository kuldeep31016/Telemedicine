#!/bin/bash

# Agora Video Integration - Installation Script
# This script installs required packages for video consultation feature

echo "🎥 Installing Agora Video Consultation Dependencies..."
echo ""

# Backend Installation
echo "📦 Installing backend packages..."
cd backend
npm install agora-access-token
echo "✅ Backend packages installed"
echo ""

# Frontend Installation
echo "📦 Installing frontend packages..."
cd ../web-react-vite
npm install agora-rtc-react agora-rtc-sdk-ng
echo "✅ Frontend packages installed"
echo ""

echo "🎉 Installation Complete!"
echo ""
echo "⚠️  IMPORTANT: Don't forget to add your AGORA_APP_CERTIFICATE to backend/.env"
echo ""
echo "Next steps:"
echo "1. Add AGORA_APP_CERTIFICATE to backend/.env"
echo "2. Restart backend: cd backend && npm run dev"
echo "3. Restart frontend: cd web-react-vite && npm run dev"
echo ""
echo "📖 See AGORA_VIDEO_SETUP.md for complete documentation"

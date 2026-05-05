#!/bin/bash

echo "Starting Frontend Setup..."

# Navigate to frontend directory
cd /home/ketha29/Desktop/Intern/pilot-project/frontend

# Install NVM locally if not installed
if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing NVM (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js v20
echo "Installing Node.js v20..."
nvm install 20
nvm use 20

# Install dependencies
echo "Installing npm dependencies..."
npm install

# Start Vite dev server
echo "Starting Vite development server..."
npm run dev

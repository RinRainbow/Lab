#!/bin/bash

# definition
REPO_URL="https://github.com/RinRainbow/Lab.git"
BASE_DIR="$HOME/Lab"
FRONTEND_DIR="$BASE_DIR/frontend"

# check and install necessary command
echo "checking necessary commands..."

# check and install git command
if ! command -v git &> /dev/null; then
  echo "git was not installed, now installing..."
  sudo apt-get update && sudo apt-get install -y git
else
  echo "git has alraedy installed."
fi

# check and install node command
if ! command -v node &> /dev/null; then
  echo "Node.js was not installed, now installing..."
  sudo apt-get update && sudo apt-get install -y nodejs
else
  echo "Node.js has alraedy installed."
fi

# check and install npm command
if ! command -v npm &> /dev/null; then
  echo "npm was not installed, now installing..."
  sudo apt-get install -y npm
else
  echo "npm has alraedy installed."
fi

# clone or update the repo
if [ -d "$BASE_DIR" ]; then
  echo "You have this repo already. Now updating..."
  cd "$BASE_DIR"
  git pull
else
  echo "cloning the repo..."
  git clone "$REPO_URL" "$BASE_DIR"
fi

# move to the frontend directory
if [ -d "$FRONTEND_DIR" ]; then
  cd "$FRONTEND_DIR"
else
  echo "frontend directory does not exist, now exitting..."
  exit 1
fi

# install npm
echo "installing npm..."
npm install

# auto build
echo "Now starting auto build."
npm run build -- --watch

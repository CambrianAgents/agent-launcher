#!/bin/bash

# Cambrian AI Agent Launcher - Complete Setup Script
# This script will install everything needed and get the app running

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        local node_version=$(node -v | sed 's/v//')
        local major_version=$(echo $node_version | cut -d. -f1)
        if [ "$major_version" -ge 16 ]; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# Function to install Node.js (macOS)
install_node_mac() {
    print_info "Installing Node.js using Homebrew..."
    if ! command_exists brew; then
        print_info "Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node
}

# Function to install Node.js (Linux)
install_node_linux() {
    print_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
}

# Function to install Node.js (Windows)
install_node_windows() {
    print_info "Detecting Windows package manager..."
    
    # Try winget first (Windows 10/11 built-in package manager)
    if command_exists winget; then
        print_info "Installing Node.js using Windows Package Manager (winget)..."
        winget install OpenJS.NodeJS
        return 0
    fi
    
    # Try Chocolatey if available
    if command_exists choco; then
        print_info "Installing Node.js using Chocolatey..."
        choco install nodejs -y
        return 0
    fi
    
    # Try Scoop if available
    if command_exists scoop; then
        print_info "Installing Node.js using Scoop..."
        scoop install nodejs
        return 0
    fi
    
    # If no package manager is available, provide manual instructions
    print_warning "No package manager found (winget, chocolatey, or scoop)"
    print_info "Please install Node.js manually:"
    echo
    echo "Option 1 - Direct Download (Recommended):"
    echo "  1. Visit: https://nodejs.org/en/download/"
    echo "  2. Download the Windows Installer (.msi)"
    echo "  3. Run the installer and follow the prompts"
    echo "  4. Restart this script"
    echo
    echo "Option 2 - Install a package manager first:"
    echo "  • Chocolatey: https://chocolatey.org/install"
    echo "  • Scoop: https://scoop.sh/"
    echo "  • winget: Built into Windows 10/11 (may need Windows updates)"
    echo
    return 1
}

# Main setup function
main() {
    clear
    print_header "🪲 Cambrian AI Agent Launcher Setup"
    
    echo -e "${GREEN}Welcome to the Cambrian AI Agent Launcher!${NC}"
    echo "This script will:"
    echo "  1. ✅ Check and install Node.js (if needed) - supports macOS, Linux & Windows"
    echo "  2. 📦 Install all dependencies"
    echo "  3. 🔧 Set up your environment variables"
    echo "  4. 🚀 Start the development server"
    echo
    echo "Let's get started!"
    echo
    read -p "Press Enter to continue..."
    
    # Step 1: Check Node.js
    print_header "Step 1: Checking Node.js Installation"
    
    if check_node_version; then
        local node_version=$(node -v)
        print_success "Node.js $node_version is already installed ✅"
    else
        print_warning "Node.js 16+ is required but not found"
        echo -n "Would you like to install Node.js? (y/N): "
        read -r install_node
        
        if [[ $install_node =~ ^[Yy]$ ]]; then
            # Detect OS and install accordingly
            if [[ "$OSTYPE" == "darwin"* ]]; then
                install_node_mac
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                install_node_linux
            elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]] || [[ -n "$WINDIR" ]]; then
                if ! install_node_windows; then
                    print_error "Automatic installation failed. Please install Node.js manually and run this script again."
                    exit 1
                fi
            else
                print_error "Unsupported operating system: $OSTYPE"
                print_info "Please install Node.js 16+ manually and run this script again."
                print_info "Visit: https://nodejs.org/en/download/"
                exit 1
            fi
            
            # Verify installation
            if check_node_version; then
                local node_version=$(node -v)
                print_success "Node.js $node_version installed successfully ✅"
            else
                print_error "Node.js installation failed. Please install manually."
                exit 1
            fi
        else
            print_error "Node.js is required to continue. Please install Node.js 16+ and run this script again."
            print_info "Visit: https://nodejs.org/en/download/"
            exit 1
        fi
    fi
    
    echo
    
    # Step 2: Install dependencies
    print_header "Step 2: Installing Dependencies"
    print_step "Installing npm packages..."
    
    if ! npm install; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    
    print_success "Dependencies installed successfully ✅"
    echo
    
    # Step 3: Environment setup
    print_header "Step 3: Environment Configuration"
    
    if [ -f ".env" ]; then
        print_info "Found existing .env file"
        echo -n "Would you like to reconfigure your environment variables? (y/N): "
        read -r reconfig
        
        if [[ ! $reconfig =~ ^[Yy]$ ]]; then
            print_info "Using existing .env configuration"
        else
            ./setup-env.sh
        fi
    else
        print_info "Setting up environment variables..."
        ./setup-env.sh
    fi
    
    echo
    
    # Step 4: Final checks and launch
    print_header "Step 4: Starting the Application"
    
    print_info "All setup complete! 🎉"
    echo
    print_step "Starting the development server..."
    print_info "The app will be available at: ${GREEN}http://localhost:3000${NC}"
    print_info "Press ${YELLOW}Ctrl+C${NC} to stop the server"
    echo
    print_warning "Keep this terminal window open while using the app"
    echo
    
    # Countdown before starting
    for i in {3..1}; do
        echo -n -e "\rStarting in $i seconds..."
        sleep 1
    done
    echo -e "\rStarting now!           "
    echo
    
    # Start the development server
    npm run dev
}

# Run the main function
main "$@" 
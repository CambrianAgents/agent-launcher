#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to prompt for input with validation
prompt_input() {
    local var_name=$1
    local description=$2
    local is_required=${3:-true}
    local is_secret=${4:-false}
    local default_value=$5
    
    while true; do
        if [ "$is_secret" = true ]; then
            echo -n -e "${BLUE}Paste your $description here${NC}: "
            read -s input_value
            echo  # Add newline after hidden input
        else
            echo -n -e "${BLUE}Enter $description${NC}"
            if [ -n "$default_value" ]; then
                echo -n " (or press Enter for default: $default_value)"
            fi
            echo -n ": "
            read input_value
        fi
        
        # Use default if no input provided
        if [ -z "$input_value" ] && [ -n "$default_value" ]; then
            input_value=$default_value
        fi
        
        # Check if required field is empty
        if [ "$is_required" = true ] && [ -z "$input_value" ]; then
            print_error "$var_name is required. Please provide a value."
            continue
        fi
        
        # Set the variable
        eval "$var_name='$input_value'"
        break
    done
}

# Function to validate private key format (basic validation)
validate_private_key() {
    local key=$1
    if [[ ! $key =~ ^0x[a-fA-F0-9]{64}$ ]]; then
        print_warning "Private key should be in format 0x followed by 64 hexadecimal characters"
        return 1
    fi
    return 0
}

# Function to validate URL format
validate_url() {
    local url=$1
    if [[ ! $url =~ ^https?:// ]]; then
        print_warning "URL should start with http:// or https://"
        return 1
    fi
    return 0
}

# Main setup function
setup_environment() {
    print_info "Setting up environment variables for Cambrian's Agent Launcher 🪲"
    echo
    
    # Check if .env already exists
    if [ -f ".env" ]; then
        print_warning ".env file already exists!"
        echo -n "Do you want to overwrite it? (y/N): "
        read -r overwrite
        if [[ ! $overwrite =~ ^[Yy]$ ]]; then
            print_info "Exiting without changes."
            exit 0
        fi
        # Backup existing .env
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        print_info "Backed up existing .env file"
    fi
    
    echo
    print_info "Let's set up your environment variables step by step..."
    echo
    
    # Step 1: OpenAI API Key
    echo -e "${GREEN}Step 1/3: OpenAI API Key${NC}"
    echo "Please paste your OpenAI API key below."
    echo "You can find this at: https://platform.openai.com/api-keys"
    echo
    prompt_input "OPENAI_API_KEY" "OpenAI API key" true true
    echo
    print_success "✅ OpenAI API key saved!"
    echo
    
    # Step 2: Sei Private Key
    echo -e "${GREEN}Step 2/3: Sei Wallet Private Key${NC}"
    echo "Please paste your Sei wallet private key below."
    echo "⚠️  The key should start with '0x' "
    echo "Note that you are in a local setup, so you don't need to worry about the key being exposed." 
    echo "If you will deploy this to a server, you should considersecure ways to store the key."
    echo
    prompt_input "SEI_PRIVATE_KEY" "Sei wallet private key" true true
    if ! validate_private_key "$SEI_PRIVATE_KEY"; then
        echo -n "Continue anyway? (y/N): "
        read -r continue_anyway
        if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
            print_error "Setup cancelled."
            exit 1
        fi
    fi
    echo
    print_success "✅ Sei private key saved!"
    echo
    
    # Step 3: RPC URL
    echo -e "${GREEN}Step 3/3: RPC URL${NC}"
    echo "Please enter the Sei RPC URL you want to use."
    echo "Press Enter to use the default: https://evm-rpc.sei-apis.com"
    echo
    prompt_input "RPC_URL" "Sei RPC URL" true false "https://evm-rpc.sei-apis.com"
    if ! validate_url "$RPC_URL"; then
        echo -n "Continue anyway? (y/N): "
        read -r continue_anyway
        if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
            print_error "Setup cancelled."
            exit 1
        fi
    fi
    echo
    print_success "✅ RPC URL configured!"
    echo
    
    # Create .env file
    print_info "Creating .env file..."
    
    cat > .env << EOF
# Sei Configuration
SEI_PRIVATE_KEY=$SEI_PRIVATE_KEY
RPC_URL=$RPC_URL

# OpenAI Configuration
OPENAI_API_KEY=$OPENAI_API_KEY

# Generated on $(date)
EOF
    
    print_success ".env file created successfully!"
    
    # Set file permissions (readable only by owner)
    chmod 600 .env
    print_info "Set .env file permissions to 600 (owner read/write only)"
    
    echo
    print_info "Environment setup complete!"
    print_warning "Remember: Never commit your .env file to version control!"
    
    # Optional: Export variables to current session
    echo
    echo -n "Do you want to export these variables to your current shell session? (y/N): "
    read -r export_vars
    if [[ $export_vars =~ ^[Yy]$ ]]; then
        export SEI_PRIVATE_KEY="$SEI_PRIVATE_KEY"
        export OPENAI_API_KEY="$OPENAI_API_KEY"
        export RPC_URL="$RPC_URL"
        print_success "Variables exported to current session!"
        echo
        print_info "To make these permanent, add the following to your ~/.bashrc or ~/.zshrc:"
        echo "export SEI_PRIVATE_KEY=\"$SEI_PRIVATE_KEY\""
        echo "export OPENAI_API_KEY=\"$OPENAI_API_KEY\""
        echo "export RPC_URL=\"$RPC_URL\""
    fi
}

# Function to load existing .env
load_env() {
    if [ -f ".env" ]; then
        print_info "Loading existing .env file..."
        set -a  # automatically export all variables
        source .env
        set +a
        print_success "Environment variables loaded!"
    else
        print_error ".env file not found. Run setup first."
        exit 1
    fi
}

# Function to show current environment
show_env() {
    print_info "Current environment variables:"
    echo
    echo "SEI_PRIVATE_KEY: ${SEI_PRIVATE_KEY:+[SET]} ${SEI_PRIVATE_KEY:-[NOT SET]}"
    echo "OPENAI_API_KEY: ${OPENAI_API_KEY:+[SET]} ${OPENAI_API_KEY:-[NOT SET]}"
    echo "RPC_URL: ${RPC_URL:-[NOT SET]}"
}

# Main script logic
case "${1:-setup}" in
    setup)
        setup_environment
        ;;
    load)
        load_env
        ;;
    show)
        show_env
        ;;
    help|--help|-h)
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "  setup    Set up environment variables and create .env file (default)"
        echo "  load     Load environment variables from existing .env file"
        echo "  show     Show current environment variable status"
        echo "  help     Show this help message"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac 
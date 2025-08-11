#!/bin/bash

# Parameterized deployment script for Aqua Stark Dojo project
# Supports dev/sepolia environments with dry-run mode

# Stop script on error
set -e

# Default values
PROFILE="sepolia"
DRY_RUN=false
VERBOSE=false

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print usage information
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Deploy Aqua Stark smart contracts to Starknet networks"
    echo ""
    echo "Options:"
    echo "  -p, --profile PROFILE   Deployment profile (dev|sepolia) [default: sepolia]"
    echo "  -d, --dry-run          Perform dry run (build and inspect only, no deployment)"
    echo "  -v, --verbose          Enable verbose output"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Environment Variables (required for sepolia):"
    echo "  DOJO_ACCOUNT_ADDRESS   Account address for deployment"
    echo "  DOJO_PRIVATE_KEY       Private key for deployment account"
    echo "  STARKNET_RPC_URL       Starknet RPC endpoint (optional, uses profile default)"
    echo ""
    echo "Examples:"
    echo "  $0 --profile dev                # Deploy to local katana"
    echo "  $0 --profile sepolia            # Deploy to sepolia testnet"
    echo "  $0 --profile sepolia --dry-run  # Dry run for sepolia"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--profile)
            PROFILE="$2"
            shift 2
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo -e "${RED}Error: Unknown option $1${NC}"
            usage
            ;;
    esac
done

# Validate profile
if [[ "$PROFILE" != "dev" && "$PROFILE" != "sepolia" ]]; then
    echo -e "${RED}Error: Profile must be 'dev' or 'sepolia'${NC}"
    exit 1
fi

# Load environment variables from file if it exists
ENV_FILE=".env.${PROFILE}"
if [ -f "$ENV_FILE" ]; then
    echo -e "${BLUE}Loading environment variables from $ENV_FILE...${NC}"
    set -a  # automatically export all variables
    source "$ENV_FILE"
    set +a
fi

# Validate required environment variables for non-dev profiles
if [[ "$PROFILE" == "sepolia" && "$DRY_RUN" == false ]]; then
    if [ -z "$DOJO_ACCOUNT_ADDRESS" ] || [ -z "$DOJO_PRIVATE_KEY" ]; then
        echo -e "${RED}Error: DOJO_ACCOUNT_ADDRESS and DOJO_PRIVATE_KEY are required for sepolia deployment${NC}"
        echo -e "${YELLOW}Please set them in .env.sepolia file or as environment variables${NC}"
        exit 1
    fi
fi

# Define cleanup function
cleanup_env() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${BLUE}Cleaning up environment variables...${NC}"
    fi
    unset STARKNET_RPC_URL 2>/dev/null || true
    unset DOJO_ACCOUNT_ADDRESS 2>/dev/null || true
    unset DOJO_PRIVATE_KEY 2>/dev/null || true
}

# Set trap for cleanup
trap cleanup_env EXIT

# Print configuration
echo -e "${GREEN}=== Aqua Stark Deployment Configuration ===${NC}"
echo -e "Profile: ${BLUE}$PROFILE${NC}"
echo -e "Dry Run: ${BLUE}$DRY_RUN${NC}"
echo -e "Verbose: ${BLUE}$VERBOSE${NC}"
if [[ "$PROFILE" == "sepolia" && -n "$DOJO_ACCOUNT_ADDRESS" ]]; then
    echo -e "Account: ${BLUE}${DOJO_ACCOUNT_ADDRESS:0:10}...${DOJO_ACCOUNT_ADDRESS: -10}${NC}"
fi
echo ""

# Clean previous build
echo -e "${YELLOW}Cleaning previous build...${NC}"
if [[ "$VERBOSE" == true ]]; then
    sozo --profile "$PROFILE" clean
else
    sozo --profile "$PROFILE" clean >/dev/null 2>&1
fi

# Build the project
echo -e "${YELLOW}Building the project...${NC}"
if [[ "$VERBOSE" == true ]]; then
    sozo --profile "$PROFILE" build
else
    sozo --profile "$PROFILE" build >/dev/null 2>&1
fi

# Inspect the build (works for both dry-run and normal deployment)
echo -e "${YELLOW}Inspecting the build...${NC}"
sozo --profile "$PROFILE" inspect

if [[ "$DRY_RUN" == true ]]; then
    echo -e "${GREEN}=== DRY RUN COMPLETED ===${NC}"
    echo -e "${BLUE}The project has been built and inspected successfully.${NC}"
    echo -e "${BLUE}No deployment was performed. To deploy for real, remove --dry-run flag.${NC}"
    exit 0
fi

# Deploy the project (only if not dry-run)
echo -e "${YELLOW}Deploying to $PROFILE...${NC}"

if [[ "$PROFILE" == "dev" ]]; then
    # Local development deployment
    sozo --profile "$PROFILE" migrate
elif [[ "$PROFILE" == "sepolia" ]]; then
    # Sepolia deployment with credentials
    sozo --profile "$PROFILE" migrate --account-address "$DOJO_ACCOUNT_ADDRESS" --private-key "$DOJO_PRIVATE_KEY" --fee strk
fi

# Success message
echo -e "${GREEN}=== DEPLOYMENT COMPLETED SUCCESSFULLY ===${NC}"
echo -e "${BLUE}Profile: $PROFILE${NC}"

if [[ "$PROFILE" == "sepolia" ]]; then
    echo -e "${YELLOW}Remember to:${NC}"
    echo -e "${YELLOW}1. Save the World address for your client configuration${NC}"
    echo -e "${YELLOW}2. Start Torii indexer with: torii --world <WORLD_ADDRESS>${NC}"
    echo -e "${YELLOW}3. Update your frontend configuration with the new addresses${NC}"
fi
#!/bin/bash

# MTX Token Deployment Script for Ethereum Network
# This script guides you through deploying the MTX token to get a legitimate contract address

echo "================================================"
echo "   MTX Token Deployment to Ethereum Network"
echo "================================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your private key and API keys."
    echo ""
    exit 1
fi

# Source environment variables
source .env

# Check if private key is set
if [ "$PRIVATE_KEY" == "your_private_key_here" ] || [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env file"
    echo ""
    echo "To deploy, you need:"
    echo "1. A wallet private key with ETH for gas"
    echo "2. Get testnet ETH from: https://sepoliafaucet.com/"
    echo "3. Add your private key to .env file (without 0x prefix)"
    echo ""
    exit 1
fi

echo "Select deployment network:"
echo "1) Ethereum Sepolia Testnet (Recommended for testing)"
echo "2) Ethereum Mainnet (Production - requires real ETH)"
echo "3) Exit"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        NETWORK="sepolia"
        echo ""
        echo "📋 Deploying to Ethereum Sepolia Testnet..."
        echo "   Get testnet ETH: https://sepoliafaucet.com/"
        echo ""
        ;;
    2)
        NETWORK="mainnet"
        echo ""
        read -p "⚠️  Are you sure you want to deploy to MAINNET? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Deployment cancelled."
            exit 0
        fi
        echo ""
        echo "�� Deploying to Ethereum Mainnet..."
        echo ""
        ;;
    3)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Compile contracts
echo "🔨 Compiling contracts..."
npx hardhat compile
if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi

echo "✅ Contracts compiled successfully"
echo ""

# Deploy contract
echo "🚀 Deploying MTX Token to $NETWORK..."
npx hardhat run scripts/deploy_mtx.js --network $NETWORK

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Deployment completed!"
echo ""

# Check if deployment file exists
DEPLOYMENT_FILE="deployments/mtx-${NETWORK}.json"
if [ -f "$DEPLOYMENT_FILE" ]; then
    CONTRACT_ADDRESS=$(cat "$DEPLOYMENT_FILE" | grep -o '"contractAddress": "[^"]*' | cut -d'"' -f4)
    
    echo "================================================"
    echo "   Deployment Information"
    echo "================================================"
    echo ""
    echo "Contract Address: $CONTRACT_ADDRESS"
    echo "Network: $NETWORK"
    echo "Deployment file: $DEPLOYMENT_FILE"
    echo ""
    
    # Ask about contract verification
    read -p "Do you want to verify the contract on Etherscan? (yes/no): " verify
    if [ "$verify" == "yes" ]; then
        if [ -z "$ETHERSCAN_API_KEY" ] || [ "$ETHERSCAN_API_KEY" == "your_etherscan_api_key" ]; then
            echo "⚠️  ETHERSCAN_API_KEY not set in .env file"
            echo "   Get API key from: https://etherscan.io/myapikey"
        else
            echo ""
            echo "🔍 Verifying contract..."
            npx hardhat verify --network $NETWORK $CONTRACT_ADDRESS "100000000" "0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a"
            echo ""
        fi
    fi
    
    # Ask about updating config
    echo ""
    read -p "Do you want to update src/config/mtx.ts with this address? (yes/no): " update_config
    if [ "$update_config" == "yes" ]; then
        # Backup current config
        cp src/config/mtx.ts src/config/mtx.ts.backup
        
        # Update the address in config
        sed -i "s/address: \"0x0000000000000000000000000000000000000000\"/address: \"$CONTRACT_ADDRESS\"/" src/config/mtx.ts
        
        echo "✅ Updated src/config/mtx.ts with new contract address"
        echo "   Backup saved to src/config/mtx.ts.backup"
    fi
    
    echo ""
    echo "================================================"
    echo "   Next Steps"
    echo "================================================"
    echo ""
    echo "1. ✅ Contract deployed successfully"
    echo "2. 📝 Update documentation with contract address"
    echo "3. 🧪 Test the contract thoroughly"
    echo "4. 💧 Add liquidity to Uniswap DEX"
    echo "5. 🎉 Announce the deployment"
    echo ""
    
    if [ "$NETWORK" == "mainnet" ]; then
        echo "🔗 View on Etherscan: https://etherscan.io/address/$CONTRACT_ADDRESS"
    else
        echo "🔗 View on Sepolia Etherscan: https://sepolia.etherscan.io/address/$CONTRACT_ADDRESS"
    fi
    echo ""
fi

echo "Done!"

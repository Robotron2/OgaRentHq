-include .env

.PHONY: all test clean build deploy-testnet verify-testnet deploy-mainnet

all: clean build test

build:
	forge build

test:
	forge test -vvv

coverage:
	forge coverage

clean:
	forge clean

# Deploy to BOT Chain Testnet (Bohr)
# Make sure your .env has PRIVATE_KEY and RPC_BOT_TESTNET set
deploy-testnet:
	forge script script/Deploy.s.sol:Deploy \
		--rpc-url $(RPC_BOT_TESTNET) \
		--broadcast \
		-vvvv

# Deploy and verify to BOT Chain Testnet
# Requires BOTSCAN_API_KEY in .env
verify-testnet:
	forge script script/Deploy.s.sol:Deploy \
		--rpc-url $(RPC_BOT_TESTNET) \
		--broadcast \
		--verify \
		--verifier-url https://scan.bohr.life/api \
		-vvvv

# Deploy to BOT Chain Mainnet
deploy-mainnet:
	forge script script/Deploy.s.sol:Deploy \
		--rpc-url $(RPC_BOT_MAINNET) \
		--broadcast \
		-vvvv

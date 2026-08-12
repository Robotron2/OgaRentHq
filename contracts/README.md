# OgaRent Smart Contracts

OgaRent is a Web2.5 real-estate rental escrow protocol on BOT Chain.

## Architecture

OgaRent uses a **Factory-based Multi-Escrow Architecture**. 

- `OgaRentFactory.sol`: The canonical protocol entry point. It is responsible for deploying independent escrow instances and maintaining on-chain discovery registries for frontends and indexers.
- `OgaRentEscrow.sol`: The core logic contract representing a single rental agreement between a tenant and a landlord. Once deployed by the factory, it is completely independent and isolated from other escrows.

### Frontend & ABI Handoff

Frontends must no longer deploy `OgaRentEscrow` directly. Instead, they must call `OgaRentFactory.createEscrow(...)` which deploys a new escrow instance, locks its configuration permanently, and returns its address.

Indexers should listen for the `EscrowCreated` event emitted by the factory to discover new rental agreements. Frontends can also query the factory using `getEscrowsByTenant` and `getEscrowsByLandlord`.

## Development

This project uses [Foundry](https://book.getfoundry.sh/).

### Build
```shell
forge build
```

### Test
```shell
forge test
```

### Deploy
```shell
forge script script/Deploy.s.sol:DeployScript --rpc-url <your_rpc_url> --private-key <your_private_key> --broadcast
```

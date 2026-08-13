# OgaRent

**OgaRent** is a blockchain-powered rental escrow platform designed to make residential renting safer in Nigeria by placing the tenant's rental payment into an on-chain escrow agreement until the agreed rental process is completed.

Built on the **BOT Chain**, OgaRent provides a transparent settlement layer that protects both tenants and landlords, ensuring funds are secure and only released when obligations are met.

---

## The Problem

The Nigerian rental market suffers from a severe lack of trust and transparency:
- **Tenant Vulnerability**: Tenants often pay substantial amounts (rent, agent fees, and caution deposits) upfront without meaningful protection or guarantees that they will actually gain access to the property.
- **Scams & Fraud**: Fake agents and fraudulent landlords exploit the lack of a secure payment mechanism, absconding with funds.
- **Landlord Insecurity**: Landlords want confidence that a prospective tenant is serious and has committed the required funds before taking a property off the market.
- **Dispute Resolution**: There is no neutral, transparent mechanism for handling disputed rental agreements when things go wrong before or during move-in.

---

## The OgaRent Solution

OgaRent solves these issues by introducing an immutable, on-chain escrow mechanism as the settlement layer for rental agreements.

1. **Landlord lists a property**
2. **Tenant discovers the property**
3. **Tenant reviews property details**
4. **Tenant creates an on-chain escrow agreement**
5. **Both parties proceed with the rental agreement**
6. **Tenant confirms occupancy/agreement completion**
7. **Escrow releases the appropriate funds**
8. **Landlord receives payment**

The key innovation is not merely "using blockchain", but leveraging it to enforce a trustless, transparent state machine that holds funds neutrally until real-world conditions are met.

---

## How It Works — User Journey

The OgaRent user journey seamlessly blends a traditional property marketplace experience with Web3 settlement.

```text
┌───────────────────────┐
│  Browse Properties    │ ◄── (Marketplace discovery)
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ View Property Details │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    Connect Wallet     │ ◄── (Web3 Authentication)
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Create Rental Escrow  │ ◄── (Factory deploys new isolated escrow)
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Funds Locked On-Chain │ ◄── (Tenant deposits Rent + Agent Fee + Caution)
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Agreement / Occupancy │ ◄── (Tenant confirms move-in)
│       Confirmed       │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Escrow Completed    │ ◄── (Rent to Landlord, Fee to Agent, Caution locked for 1 yr)
│    Funds Released     │
└───────────────────────┘
```

### The Dispute Path

If the agreement breaks down (e.g., the property is unavailable or misrepresented), funds are protected:

```text
       Tenant or Landlord
               │
               ▼
         Raise Dispute
               │
               ▼
           Disputed
               │
               ▼
   Platform Admin Resolution
               │
       ┌───────┴───────┐
       ▼               ▼
    Tenant          Landlord
 (Refunded)       (Compensated)
```

---

## Why OgaRent Is Different

- **Rental-Specific Escrow**: Unlike generic token transfer tools, OgaRent models the specific financial buckets of Nigerian real estate: Rent, Agent Fees, and Caution Deposits.
- **Property Discovery + Escrow Workflow**: Combines an intuitive property marketplace with secure on-chain settlement in one application.
- **Transparent State Transitions**: Every step of the rental agreement is permanently recorded on-chain.
- **Factory Architecture**: Each rental agreement gets its own independent, isolated smart contract instance. One agreement cannot affect another.
- **BOT Chain Deployment**: Leverages the speed and EVM compatibility of BOT Chain to bring real-world assets (RWA) and agreements on-chain.

---

## Smart Contract Architecture

OgaRent uses a Factory pattern to ensure every tenant-landlord relationship is isolated and secure.

```text
       OgaRentFactory (Registry & Entry Point)
                 │
                 ├── creates ──► OgaRentEscrow #1 (Tenant A, Landlord A)
                 │
                 ├── creates ──► OgaRentEscrow #2 (Tenant B, Landlord B)
                 │
                 ├── creates ──► OgaRentEscrow #3 (Tenant C, Landlord C)
                 │
                 └── creates ──► OgaRentEscrow #N
```

- **OgaRentFactory**: The protocol entry point. It deploys new escrow instances and maintains on-chain mappings of escrows by tenant and landlord for easy discovery.
- **OgaRentEscrow**: An isolated contract for a single rental agreement. It holds immutable configuration (roles, amounts, token address) and manages the state machine and funds for that specific agreement.

---

## Escrow State Machine

The lifecycle of an OgaRent agreement is strictly controlled by a five-state machine.

```text
               ┌──────────────┐
               │   Created    │
               └──────┬───────┘
                      │ deposit()
                      ▼
               ┌──────────────┐
               │    Funded    │
               └──────┬───────┘
                      │
            confirmOccupancy()
                      │
                      ▼
               ┌──────────────┐
               │   Occupied   │
               └──────┬───────┘
                      │
         ┌────────────┴────────────┐
         │                         │
  raiseDispute()              claimCaution() (after 365 days)
         │                         │
         ▼                         ▼
  ┌──────────────┐          ┌──────────────┐
  │   Disputed   │          │  Completed   │
  └──────┬───────┘          └──────────────┘
         │
  resolveDispute()
         │
         ▼
  ┌──────────────┐
  │  Completed   │
  └──────────────┘
```

### Transition Table

| Current State | Action | Authorized Caller | Next State | Fund Movement |
|---|---|---|---|---|
| `Created` | `deposit()` | Tenant | `Funded` | Transfers mUSDC from Tenant to Escrow |
| `Funded` | `confirmOccupancy()` | Tenant | `Occupied` | Rent -> Landlord, Fee -> Agent |
| `Funded` / `Occupied` | `raiseDispute()` | Tenant / Landlord | `Disputed` | None (Pauses fund distribution) |
| `Disputed` | `resolveDispute(payLandlord)`| Platform Admin | `Completed`| Remaining balance -> Landlord OR Tenant |
| `Occupied` | `claimCaution()` | Tenant | `Completed` | Caution Deposit -> Tenant (after 1 year) |

---

## Escrow Financial Model

OgaRent handles three distinct financial components for every rental:

1. **Rent**: The primary lease payment.
2. **Agent Fee**: Facilitation fee for the real estate agent.
3. **Caution Deposit**: Security deposit against damages.

**Money Flow:**

```text
       Tenant
         │
         │ (ERC-20 approval + deposit)
         ▼
    OgaRentEscrow
         │
         ├──► Agent (Agent Fee) — Released immediately on Occupancy
         │
         ├──► Landlord (Rent) — Released immediately on Occupancy
         │
         └──► Escrow (Caution Deposit) — Locked in contract for 365 days
```

After the 365-day lease duration expires, the Tenant can call `claimCaution()` to retrieve the locked deposit (assuming no active dispute).

---

## Factory + Multi-Escrow Model

Why use a factory instead of a single monolithic contract?
- **Isolation**: Each escrow has its own isolated funds and state. A bug or dispute in one agreement cannot halt the entire platform.
- **Immutable Configuration**: Once deployed, the terms (roles, amounts) of an individual escrow cannot be altered, ensuring absolute trust between the specific tenant and landlord.
- **Concurrency**: Multiple rentals can exist and transition states simultaneously without complex data structures.

**Example:**
- **Property A**: Tenant A and Landlord A interact exclusively with **Escrow A**.
- **Property B**: Tenant B and Landlord B interact exclusively with **Escrow B**.
Actions on Escrow A have zero impact on Escrow B.

---

## BOT Chain Integration

OgaRent is deployed as EVM-compatible Solidity smart contracts on the BOT Chain.

- **Target Network**: BOT Chain Mainnet (Chain ID 677) / BOT Chain Testnet (Bohr, Chain ID 968).
- **Current Deployment**: Deployed and tested on BOT Chain Testnet (Bohr).
- **Currency**: Transactions use `mUSDC` (an ERC-20 stablecoin representation) to avoid price volatility during the rental term.

| Operation | On-Chain? | Description |
|---|---|---|
| Browse property listings | Off-chain | High-speed browsing via the Next.js frontend. |
| View property details | Off-chain | Details fetched from the UI application state. |
| Create escrow | **On-Chain** | Factory deploys a new escrow contract instance. |
| Deposit funds | **On-Chain** | ERC-20 transfer from tenant to the Escrow contract. |
| Confirm occupancy | **On-Chain** | State update and ERC-20 transfers to landlord and agent. |
| Raise dispute | **On-Chain** | State update locking funds. |
| Resolve dispute | **On-Chain** | Admin distributes remaining funds. |

---

## Frontend Architecture

The OgaRent application provides a modern, responsive, and cinematic user experience.

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Web3 Integration**: Wagmi, Viem, and RainbowKit
- **Icons**: Lucide React

**Key Pages:**
- **Landing/Home** (`/`): Cinematic property discovery with category filters.
- **How It Works** (`/how-it-works`): Detailed explanation of the escrow journey.
- **Property Details** (`/property/[id]`): In-depth view of a specific property with the option to initiate an escrow.
- **Dashboard** (`/dashboard`): User portal to view and manage active escrow agreements (depositing, confirming occupancy, etc.).

---

## Property Discovery

*Note: For the purpose of the hackathon, property listings are statically mocked to demonstrate the user flow.*

The frontend includes a rich mock dataset (`client/data/properties.ts`) featuring various property types (Apartments, Duplexes, Commercial spaces) across Lagos neighborhoods.
- Each listing is associated with a mock landlord and agent address.
- Selecting a property and clicking "Proceed to Escrow" seamlessly transitions the user from off-chain discovery to on-chain settlement, automatically populating the escrow creation transaction with the correct roles and amounts.

---

## Wallet + Transaction Flow

The interaction between the user and the BOT Chain is seamless:

```text
       User
         │
         ▼
  Connect Wallet (RainbowKit)
         │
         ▼
  Initiate Escrow (Frontend)
         │
         ▼
  Wallet Confirmation Prompt
         │
         ▼
  BOT Chain Transaction (Factory.createEscrow)
         │
         ▼
  Contract State Updated (New Escrow Address Generated)
         │
         ▼
  Frontend Reflects New State (Redirects to Dashboard)
```

---

## Security Considerations

OgaRent implements strict engineering practices to secure user funds:
- **ReentrancyGuard**: Applied to all state-changing functions to prevent reentrancy attacks.
- **SafeERC20**: Used for all token transfers to handle non-standard ERC-20 implementations safely.
- **Strict State Guards**: Functions revert if called in the wrong state (e.g., cannot `deposit` if already `Funded`).
- **Access Control**: Role-based access ensures only the designated tenant can deposit or confirm occupancy, and only the admin can resolve disputes.
- **Constructor Validation**: Prevents deployment of escrows with zero addresses, zero amounts, or invalid fee ratios.
- **Terminal States**: The `Completed` state prevents any further interaction or fund movement, eliminating replay risks.

*Disclaimer: OgaRent is a hackathon/MVP project and has not undergone a formal third-party smart contract security audit.*

---

## Smart Contract Testing

The repository includes a comprehensive Foundry test suite covering unit tests, state transitions, accounting, disputes, factory deployment, and multi-escrow isolation.

To run the test suite:

```bash
cd contracts

# Build the contracts
forge build

# Run the test suite
forge test

# Run tests with detailed verbosity
forge test -vv

# Format code
forge fmt
```

---

## Local Development

### Prerequisites
- [Git](https://git-scm.com/)
- [Foundry](https://getfoundry.sh/) (for smart contracts)
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)
- A Web3 Wallet (e.g., MetaMask) configured for BOT Chain Testnet

### Smart Contracts

```bash
# Navigate to the contracts directory
cd contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test
```

### Frontend

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## Environment Variables

To run the project locally, configure the following environment variables.

### Frontend (`client/.env.local`)

```env
# The address of the deployed OgaRentFactory contract
NEXT_PUBLIC_FACTORY_ADDRESS=0x8C90f76C40bD4213983ECbB38F92AeECd71e348b

# The address of the Mock USDC token
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0x10B4265cD6cdA440025d7e142991c9ba8Ec918Ca

# BOT Chain Testnet Chain ID
NEXT_PUBLIC_CHAIN_ID=968

# WalletConnect Project ID (for RainbowKit)
NEXT_PUBLIC_APP_ID=your_walletconnect_project_id
```

### Smart Contracts (`contracts/.env`)

```env
# Deployment Private Key (DO NOT COMMIT)
PRIVATE_KEY=your_private_key_here

# BOT Chain Testnet Configuration
RPC_BOT_TESTNET=https://rpc.bohr.life
CHAIN_ID_TESTNET=968
EXPLORER_BOT_TESTNET=https://scan.bohr.life/

# BOT Chain Mainnet Configuration
RPC_BOT_MAINNET=https://rpc.botchain.ai
CHAIN_ID_MAINNET=677
EXPLORER_BOT_MAINNET=https://scan.botchain.ai/
```

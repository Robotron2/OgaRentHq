# OgaRent Application

> A Web2.5 milestone-driven rental escrow protocol built on Stellar/Soroban.

Welcome to the `ogarent-app` repository. This repository powers both the Next.js Web2 frontend and the Stellar gas-relayer backend for the OgaRent ecosystem. 

This repository houses the **Minimum Viable Product (MVP)** frontend, which is fully functional and successfully demonstrates the core Web2.5 user experience and architecture.

---

## Application Responsibilities

This repository is designed to achieve two primary technical goals, both aimed at completely hiding blockchain complexity from the end user.

### Authentication via Passkeys (SEP-44)

Traditional blockchain applications force users to manage seed phrases or browser extension wallets. This creates massive friction for everyday renters and landlords. 

OgaRent implements the **Stellar SEP-44 Passkey standard**. This allows users to authenticate and sign transactions using their device's built-in security (like FaceID, TouchID, or Windows Hello). The user experiences a standard Web2 login flow, while under the hood, secure cryptographic keys are generated and used to authorize smart contract interactions.

### Transaction Sponsorship (Gas Relayer)

Users should never encounter "insufficient funds for gas" errors. To achieve this, OgaRent utilizes an Account Abstraction pattern.

When a user signs an intent (like depositing rent or confirming occupancy), the frontend does not submit the transaction directly to the Stellar network. Instead, it forwards the signed transaction to our backend Relayer API. The backend wraps the user's transaction, sponsors the network fee using a dedicated pool of Lumens, and submits it to the network on the user's behalf. 

---

## Repository Structure

The codebase is organized using modern Next.js App Router conventions:

* **`app/`**: Contains the Next.js App Router pages and layouts. Frontend contributors will build UI flows here.
* **`app/api/`**: Contains Next.js Route Handlers. Backend contributors will implement the gas-relayer and off-chain data validation here.
* **`components/`**: Contains reusable React components (buttons, layout wrappers, dashboard cards).
* **`lib/stellar/`**: Contains the core Web3 utilities. This is where Soroban contract interactions and Passkey authentication flows will be implemented.

Contributors should work strictly within the module defined by their assigned issue.

---

## Roadmaps & Drips Wave Contributors

This repository is actively seeking Drips Wave program participants to build out advanced Web2.5 features. We encourage contributors to implement isolated features within the existing scaffold.

Please review the **[Application Roadmap](ROADMAP.md)** for details on upcoming phases such as SEP-44 Passkey flows, Gas Relayer API implementations, and Fiat Anchor integrations.

Look for issues tagged with `Wave-Medium` or `Wave-High` to get started!

---

## Development

Make sure you have Node.js installed, then clone the repository and run:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the application scaffold.

---

## Design Philosophy

* **Familiar UX:** The application must feel exactly like a traditional Web2 property portal.
* **Invisible Blockchain:** Blockchain terminology (wallets, gas, hashes) should never be exposed in the UI.
* **Modular Architecture:** Clear boundaries between UI components, backend routes, and Stellar utilities.
* **Contributor Friendliness:** The foundation is already built; contributors can focus purely on feature execution.

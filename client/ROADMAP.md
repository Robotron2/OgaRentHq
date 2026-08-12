# OgaRent Application Roadmap

This roadmap outlines the path for the Next.js frontend and the gas-relayer backend. Drips Wave contributors are encouraged to pick up issues related to these phases.

## Phase 1: MVP Frontend — Completed
- [x] Responsive layout scaffold
- [x] Framer Motion animations for Hero and UI elements
- [x] Landing page UI
- [x] Login and Registration scaffold

## Phase 2: Account Abstraction (SEP-44)
We need to remove traditional Web3 wallets from the UX.
- **Passkey Integration:** Implement WebAuthn so users can authenticate and sign transactions using device biometrics (FaceID/TouchID).
- **Session Management:** Securely store and manage session keys within the browser without exposing users to seed phrases.

## Phase 3: The Gas Relayer
Users should never pay for gas directly.
- **Relayer API Route:** Create a Next.js API route that accepts a user's signed transaction intent.
- **Transaction Sponsorship:** The backend wraps the transaction, pays the Soroban network fee from a centralized Lumen pool, and submits it to the network.

## Phase 4: Fiat On/Off Ramps (Stellar Anchors)
Renters pay in Naira, landlords receive Naira, but the protocol settles in USDC.
- **Anchor API Integration:** Hook into Nigerian Stellar Anchors to process fiat bank transfers automatically.
- **Instant Settlement:** Ensure the UI correctly displays pending fiat-to-stablecoin conversions so users are never confused by crypto terminology.

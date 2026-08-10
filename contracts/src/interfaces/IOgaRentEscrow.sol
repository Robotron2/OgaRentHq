// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IOgaRentEscrow
 * @notice External interface for the OgaRent milestone-driven rental escrow protocol.
 *
 * @dev Defines the complete domain model for the escrow lifecycle:
 *      - EscrowState: the five-state machine governing valid transitions.
 *      - EscrowConfig: the immutable configuration set at initialization.
 *      - Events: the full on-chain audit trail required by the frontend and judges.
 *      - Function signatures: all six public entry points.
 *
 * The implemented state machine is:
 *
 *   Created ──deposit()──► Funded ──confirmOccupancy()──► Occupied
 *                              │                               │
 *                         raiseDispute()              raiseDispute()
 *                              │                               │
 *                              └──────────► Disputed ◄─────────┘
 *                                               │
 *                                        resolveDispute()
 *                                               │
 *                   claimCaution() ◄── Completed ◄──────────────
 *                   (from Occupied)
 *
 * @custom:security-contact security@ogarent.xyz
 */
interface IOgaRentEscrow {
    // =========================================================================
    // State Machine
    // =========================================================================

    /**
     * @notice Represents the current lifecycle state of the rental escrow.
     *
     * @dev States are strictly ordered and transitions are one-directional.
     *      No state may be revisited once left, with the sole exception that
     *      both Funded and Occupied may enter Disputed.
     *
     * Created   — Escrow is configured but unfunded.
     * Funded    — Tenant has locked rent + agent fee + caution deposit.
     * Occupied  — Tenant confirmed move-in; rent and agent fee have been paid out.
     * Disputed  — A party has raised a dispute; admin resolution is pending.
     * Completed — Terminal state; all funds have been distributed.
     */
    enum EscrowState {
        Created,
        Funded,
        Occupied,
        Disputed,
        Completed
    }

    // =========================================================================
    // Configuration
    // =========================================================================

    /**
     * @notice Immutable configuration for a single rental escrow agreement.
     *
     * @dev Set once during `initialize()` and never modified.
     *      All addresses must be non-zero. All amounts must be positive.
     *      agentFee must be strictly less than rentAmount.
     *
     * @param tenant          The address of the renting party. Funds the escrow and
     *                        confirms occupancy.
     * @param landlord        The address of the property owner. Receives rent on
     *                        occupancy confirmation.
     * @param agent           The address of the facilitating agent. Receives agentFee
     *                        on occupancy confirmation.
     * @param platformAdmin   The address of the OgaRent platform administrator.
     *                        The sole authority to resolve disputes.
     * @param token           The ERC-20 token used for all escrow payments (mUSDC).
     * @param rentAmount      The yearly rent in token atomic units (6 decimals).
     * @param agentFee        The agent facilitation fee in token atomic units.
     *                        Released to agent on occupancy. Must be < rentAmount.
     * @param cautionDeposit  The refundable security deposit in token atomic units.
     *                        Held until lease expiry or dispute resolution.
     */
    struct EscrowConfig {
        address tenant;
        address landlord;
        address agent;
        address platformAdmin;
        address token;
        uint256 rentAmount;
        uint256 agentFee;
        uint256 cautionDeposit;
    }

    // =========================================================================
    // Events
    // =========================================================================

    /**
     * @notice Emitted when the escrow is successfully initialized.
     * @dev Provides the full configuration for frontend indexing and judge verification.
     * @param tenant         The tenant address.
     * @param landlord       The landlord address.
     * @param agent          The agent address.
     * @param platformAdmin  The platform administrator address.
     * @param token          The ERC-20 token address.
     * @param rentAmount     The yearly rent amount.
     * @param agentFee       The agent fee amount.
     * @param cautionDeposit The caution deposit amount.
     */
    event EscrowInitialized(
        address indexed tenant,
        address indexed landlord,
        address indexed agent,
        address platformAdmin,
        address token,
        uint256 rentAmount,
        uint256 agentFee,
        uint256 cautionDeposit
    );

    /**
     * @notice Emitted when the tenant successfully deposits funds into the escrow.
     * @param tenant      The tenant address.
     * @param totalAmount The total amount deposited (rent + agentFee + cautionDeposit).
     */
    event RentDeposited(address indexed tenant, uint256 totalAmount);

    /**
     * @notice Emitted when the tenant confirms successful move-in.
     * @dev At this point, agentFee and rentAmount have already been transferred out.
     *      Only cautionDeposit remains in the escrow.
     * @param tenant             The tenant address.
     * @param agentFeeReleased   Amount transferred to the agent.
     * @param rentReleased       Amount transferred to the landlord.
     * @param cautionLocked      Amount remaining locked in escrow.
     * @param occupancyTimestamp The block timestamp at which occupancy was confirmed.
     *                           Marks the start of the 365-day caution timelock.
     */
    event OccupancyConfirmed(
        address indexed tenant,
        uint256 agentFeeReleased,
        uint256 rentReleased,
        uint256 cautionLocked,
        uint256 occupancyTimestamp
    );

    /**
     * @notice Emitted when a dispute is raised by the tenant or landlord.
     * @param raisedBy      The address that raised the dispute.
     * @param previousState The escrow state at the time the dispute was raised
     *                      (either Funded or Occupied).
     */
    event DisputeRaised(address indexed raisedBy, EscrowState previousState);

    /**
     * @notice Emitted when the platform administrator resolves a dispute.
     * @param admin          The platform administrator address.
     * @param recipient      The address that received the remaining escrow balance.
     * @param amount         The total amount transferred to the recipient.
     * @param paidToLandlord True if funds went to the landlord; false if to the tenant.
     */
    event DisputeResolved(
        address indexed admin,
        address indexed recipient,
        uint256 amount,
        bool paidToLandlord
    );

    /**
     * @notice Emitted when the tenant successfully claims the caution deposit
     *         after lease expiry.
     * @param tenant    The tenant address.
     * @param amount    The caution deposit amount returned.
     * @param claimedAt The block timestamp of the claim.
     */
    event CautionClaimed(address indexed tenant, uint256 amount, uint256 claimedAt);

    // =========================================================================
    // Functions
    // =========================================================================

    /**
     * @notice Initializes the escrow with the rental agreement configuration.
     * @dev May only be called once. Caller is not restricted but double-init is blocked.
     * @param config The complete escrow configuration.
     */
    function initialize(EscrowConfig calldata config) external;

    /**
     * @notice Allows the tenant to deposit the full rental amount into escrow.
     * @dev Caller must be the tenant. State must be Created.
     *      Requires prior ERC-20 approval of (rentAmount + agentFee + cautionDeposit).
     */
    function deposit() external;

    /**
     * @notice Allows the tenant to confirm successful move-in.
     * @dev Caller must be the tenant. State must be Funded.
     *      Releases agentFee to agent and rentAmount to landlord.
     *      Locks cautionDeposit and starts the 365-day timelock.
     */
    function confirmOccupancy() external;

    /**
     * @notice Raises a dispute, pausing fund distribution pending admin resolution.
     * @dev Caller must be the tenant or landlord. State must be Funded or Occupied.
     *      No funds are moved by this call.
     */
    function raiseDispute() external;

    /**
     * @notice Resolves an active dispute by distributing all remaining funds.
     * @dev Caller must be the platformAdmin. State must be Disputed.
     *      Transfers the entire remaining escrow token balance to either the
     *      landlord (payLandlord == true) or the tenant (payLandlord == false).
     * @param payLandlord If true, remaining balance goes to landlord; otherwise to tenant.
     */
    function resolveDispute(bool payLandlord) external;

    /**
     * @notice Allows the tenant to claim the caution deposit after lease expiry.
     * @dev Caller must be the tenant. State must be Occupied.
     *      block.timestamp must be strictly greater than occupancyTimestamp + 365 days.
     */
    function claimCaution() external;
}

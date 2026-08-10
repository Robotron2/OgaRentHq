// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IOgaRentEscrow.sol";

/**
 * @title OgaRentEscrow
 * @notice A milestone-driven rental escrow protocol for the Nigerian rental market.
 *
 * @dev Implements the OgaRent escrow lifecycle on BOT Chain EVM.
 *      Migrated from Stellar/Soroban to EVM/Solidity for the hackathon.
 *
 *      The escrow manages three financial buckets for a single rental agreement:
 *        - rentAmount     → released to landlord on occupancy confirmation
 *        - agentFee       → released to agent on occupancy confirmation
 *        - cautionDeposit → held for 365 days, then claimable by tenant
 *
 *      State machine:
 *        Created → Funded → Occupied → Completed  (happy path)
 *        Funded/Occupied → Disputed → Completed   (dispute path)
 *
 *      Security properties:
 *        - ReentrancyGuard on all state-changing functions
 *        - Checks-Effects-Interactions ordering throughout
 *        - SafeERC20 for all token interactions
 *        - Single-initialization guard
 *        - Terminal Completed state prevents replay
 *        - No ETH acceptance (no receive/fallback)
 *
 * @custom:security-contact security@ogarent.xyz
 */
contract OgaRentEscrow is IOgaRentEscrow, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // =========================================================================
    // Constants
    // =========================================================================

    /// @notice The duration the caution deposit is locked after occupancy confirmation.
    uint256 public constant LEASE_DURATION = 365 days;

    // =========================================================================
    // Storage
    // =========================================================================

    /// @dev Prevents double-initialization. Set to true on first initialize() call.
    bool private _initialized;

    /// @notice The immutable configuration for this escrow agreement.
    EscrowConfig private _config;

    /// @notice The current lifecycle state of this escrow.
    EscrowState private _state;

    /// @notice The block timestamp recorded when the tenant confirmed occupancy.
    ///         Used as the start of the 365-day caution deposit timelock.
    ///         Zero until confirmOccupancy() is called.
    uint256 public occupancyTimestamp;

    // =========================================================================
    // Initialization
    // =========================================================================

    /**
     * @notice Initializes the escrow with the rental agreement configuration.
     *
     * @dev May only be called once. There is no caller restriction on this function
     *      itself — the initialization guard (_initialized) provides the security.
     *      After initialization, the escrow state is Created and the configuration
     *      is locked permanently.
     *
     *      Validations enforced:
     *        - Not already initialized
     *        - All role addresses are non-zero
     *        - Token address is non-zero
     *        - rentAmount > 0
     *        - agentFee > 0
     *        - cautionDeposit > 0
     *        - agentFee < rentAmount (logical invariant: fee cannot exceed rent)
     *
     * @param config The complete escrow configuration.
     */
    function initialize(EscrowConfig calldata config) external override {
        // Guard: prevent re-initialization
        require(!_initialized, "OgaRent: already initialized");

        // Validate role addresses
        require(config.tenant != address(0), "OgaRent: zero tenant");
        require(config.landlord != address(0), "OgaRent: zero landlord");
        require(config.agent != address(0), "OgaRent: zero agent");
        require(config.platformAdmin != address(0), "OgaRent: zero admin");
        require(config.token != address(0), "OgaRent: zero token");

        // Validate amounts
        require(config.rentAmount > 0, "OgaRent: zero rent");
        require(config.agentFee > 0, "OgaRent: zero agent fee");
        require(config.cautionDeposit > 0, "OgaRent: zero caution");
        require(config.agentFee < config.rentAmount, "OgaRent: fee >= rent");

        // Effects: mark initialized, store config, set initial state
        _initialized = true;
        _config = config;
        _state = EscrowState.Created;

        emit EscrowInitialized(
            config.tenant,
            config.landlord,
            config.agent,
            config.platformAdmin,
            config.token,
            config.rentAmount,
            config.agentFee,
            config.cautionDeposit
        );
    }

    // =========================================================================
    // View Functions
    // =========================================================================

    /**
     * @notice Returns the full escrow configuration.
     * @return The EscrowConfig struct set during initialization.
     */
    function getConfig() external view returns (EscrowConfig memory) {
        return _config;
    }

    /**
     * @notice Returns the current escrow state.
     * @return The current EscrowState enum value.
     */
    function getState() external view returns (EscrowState) {
        return _state;
    }

    // =========================================================================
    // Placeholder stubs — implemented in Phase 4–7
    // =========================================================================

    /**
     * @notice Allows the tenant to deposit the full rental amount into escrow.
     *
     * @dev Caller must be the tenant. State must be Created.
     *      Requires a prior ERC-20 approval of (rentAmount + agentFee + cautionDeposit)
     *      from the tenant to this contract address.
     *
     *      Checks-Effects-Interactions:
     *        1. Check: state guard and caller identity
     *        2. Effect: transition state to Funded, emit event
     *        3. Interact: pull tokens from tenant via safeTransferFrom
     */
    function deposit() external override nonReentrant {
        // Checks
        require(_state == EscrowState.Created, "OgaRent: invalid state");
        require(msg.sender == _config.tenant, "OgaRent: not tenant");

        uint256 total = _config.rentAmount + _config.agentFee + _config.cautionDeposit;

        // Effects
        _state = EscrowState.Funded;
        emit RentDeposited(msg.sender, total);

        // Interactions
        IERC20(_config.token).safeTransferFrom(msg.sender, address(this), total);
    }

    /**
     * @notice Allows the tenant to confirm successful move-in.
     * @dev Caller must be the tenant. State must be Funded.
     *      Releases agentFee to agent and rentAmount to landlord.
     *      Locks cautionDeposit and starts the 365-day timelock.
     */
    function confirmOccupancy() external override nonReentrant {
        // Checks
        require(_state == EscrowState.Funded, "OgaRent: invalid state");
        require(msg.sender == _config.tenant, "OgaRent: not tenant");

        // Effects
        _state = EscrowState.Occupied;
        occupancyTimestamp = block.timestamp;

        emit OccupancyConfirmed(
            msg.sender,
            _config.agentFee,
            _config.rentAmount,
            _config.cautionDeposit,
            block.timestamp
        );

        // Interactions
        IERC20(_config.token).safeTransfer(_config.agent, _config.agentFee);
        IERC20(_config.token).safeTransfer(_config.landlord, _config.rentAmount);
    }

    /// @inheritdoc IOgaRentEscrow
    function raiseDispute() external override nonReentrant {
        revert("OgaRent: not implemented");
    }

    /// @inheritdoc IOgaRentEscrow
    function resolveDispute(bool) external override nonReentrant {
        revert("OgaRent: not implemented");
    }

    /// @inheritdoc IOgaRentEscrow
    function claimCaution() external override nonReentrant {
        revert("OgaRent: not implemented");
    }
}

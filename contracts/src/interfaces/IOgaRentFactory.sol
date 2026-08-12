// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IOgaRentFactory
 * @notice External interface for the OgaRent factory.
 *
 * @dev The factory is responsible for deploying independent OgaRentEscrow
 *      instances for each rental agreement, and tracking them in registries
 *      for easy frontend discovery.
 *
 * @custom:security-contact security@ogarent.xyz
 */
interface IOgaRentFactory {
    // =========================================================================
    // Events
    // =========================================================================

    /**
     * @notice Emitted when a new escrow instance is created by the factory.
     * @dev Provides the full configuration for frontend indexing and judge verification.
     * @param escrow         The address of the newly deployed escrow instance.
     * @param tenant         The tenant address.
     * @param landlord       The landlord address.
     * @param agent          The agent address.
     * @param platformAdmin  The platform administrator address.
     * @param token          The ERC-20 token address.
     * @param rentAmount     The yearly rent amount.
     * @param agentFee       The agent fee amount.
     * @param cautionDeposit The caution deposit amount.
     */
    event EscrowCreated(
        address indexed escrow,
        address indexed tenant,
        address indexed landlord,
        address agent,
        address platformAdmin,
        address token,
        uint256 rentAmount,
        uint256 agentFee,
        uint256 cautionDeposit
    );

    // =========================================================================
    // Functions
    // =========================================================================

    /**
     * @notice Deploys a new independent OgaRentEscrow instance.
     * @dev Validates configuration before deployment. The escrow address is
     *      registered in the factory's internal state.
     * @param tenant         The address of the renting party.
     * @param landlord       The address of the property owner.
     * @param agent          The address of the facilitating agent.
     * @param platformAdmin  The address of the OgaRent platform administrator.
     * @param token          The ERC-20 token used for all escrow payments (mUSDC).
     * @param rentAmount     The yearly rent in token atomic units (6 decimals).
     * @param agentFee       The agent facilitation fee in token atomic units.
     * @param cautionDeposit The refundable security deposit in token atomic units.
     * @return escrowAddress The address of the newly deployed OgaRentEscrow.
     */
    function createEscrow(
        address tenant,
        address landlord,
        address agent,
        address platformAdmin,
        address token,
        uint256 rentAmount,
        uint256 agentFee,
        uint256 cautionDeposit
    ) external returns (address escrowAddress);

    /**
     * @notice Returns the total number of escrows created by the factory.
     */
    function getEscrowCount() external view returns (uint256);

    /**
     * @notice Returns the address of a created escrow by its global index.
     * @param index The index in the global registry (0-based).
     */
    function getEscrow(uint256 index) external view returns (address);

    /**
     * @notice Returns all escrow addresses associated with a specific tenant.
     * @param tenant The tenant address to query.
     */
    function getEscrowsByTenant(address tenant) external view returns (address[] memory);

    /**
     * @notice Returns all escrow addresses associated with a specific landlord.
     * @param landlord The landlord address to query.
     */
    function getEscrowsByLandlord(address landlord) external view returns (address[] memory);
}

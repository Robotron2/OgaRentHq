// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOgaRentFactory.sol";
import "./interfaces/IOgaRentEscrow.sol";
import "./OgaRentEscrow.sol";

/**
 * @title OgaRentFactory
 * @notice The canonical protocol entry point for creating OgaRent escrow agreements.
 *
 * @dev Deploys independent OgaRentEscrow instances and maintains on-chain registries
 *      for discovery by frontends and indexers.
 *
 * @custom:security-contact security@ogarent.xyz
 */
contract OgaRentFactory is IOgaRentFactory {
    /// @dev Global registry of all deployed escrows.
    address[] private _escrows;

    /// @dev Tenant discovery registry.
    mapping(address => address[]) private _tenantEscrows;

    /// @dev Landlord discovery registry.
    mapping(address => address[]) private _landlordEscrows;

    /**
     * @notice Deploys a new independent OgaRentEscrow instance.
     * @dev Validation of parameters is handled by the OgaRentEscrow constructor.
     *      This function is permissionless.
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
    ) external override returns (address) {
        IOgaRentEscrow.EscrowConfig memory config = IOgaRentEscrow.EscrowConfig({
            tenant: tenant,
            landlord: landlord,
            agent: agent,
            platformAdmin: platformAdmin,
            token: token,
            rentAmount: rentAmount,
            agentFee: agentFee,
            cautionDeposit: cautionDeposit
        });

        // Deploy the new escrow instance
        // The constructor will revert if any validation fails
        OgaRentEscrow newEscrow = new OgaRentEscrow(config);
        address escrowAddress = address(newEscrow);

        // Register the instance
        _escrows.push(escrowAddress);
        _tenantEscrows[tenant].push(escrowAddress);
        _landlordEscrows[landlord].push(escrowAddress);

        // Emit canonical creation event
        emit EscrowCreated(
            escrowAddress,
            tenant,
            landlord,
            agent,
            platformAdmin,
            token,
            rentAmount,
            agentFee,
            cautionDeposit
        );

        return escrowAddress;
    }

    /**
     * @notice Returns the total number of escrows created by the factory.
     */
    function getEscrowCount() external view override returns (uint256) {
        return _escrows.length;
    }

    /**
     * @notice Returns the address of a created escrow by its global index.
     * @param index The index in the global registry (0-based).
     */
    function getEscrow(uint256 index) external view override returns (address) {
        require(index < _escrows.length, "OgaRentFactory: index out of bounds");
        return _escrows[index];
    }

    /**
     * @notice Returns all escrow addresses associated with a specific tenant.
     * @param tenant The tenant address to query.
     */
    function getEscrowsByTenant(address tenant) external view override returns (address[] memory) {
        return _tenantEscrows[tenant];
    }

    /**
     * @notice Returns all escrow addresses associated with a specific landlord.
     * @param landlord The landlord address to query.
     */
    function getEscrowsByLandlord(address landlord) external view override returns (address[] memory) {
        return _landlordEscrows[landlord];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OgaRentFactory.sol";
import "../src/OgaRentEscrow.sol";
import "../src/MockUSDC.sol";
import "./helpers/EscrowTestBase.sol";

/**
 * @title OgaRentFactoryTest
 * @notice Tests the factory deployment and registry functionality.
 */
contract OgaRentFactoryTest is EscrowTestBase {
    OgaRentFactory public factory;

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

    function setUp() public override {
        super.setUp();
        factory = new OgaRentFactory();
    }

    function test_createEscrow_success() public {
        address newEscrow = factory.createEscrow(
            tenant,
            landlord,
            agent,
            admin,
            address(token),
            RENT_AMOUNT,
            AGENT_FEE,
            CAUTION_DEPOSIT
        );

        assertTrue(newEscrow != address(0));
        assertEq(factory.getEscrowCount(), 1);
        assertEq(factory.getEscrow(0), newEscrow);
    }

    function test_createEscrow_emitsEvent() public {
        vm.expectEmit(false, true, true, true, address(factory));
        emit EscrowCreated(
            address(0), // Ignored by expectEmit since checkTopic1=false
            tenant,
            landlord,
            agent,
            admin,
            address(token),
            RENT_AMOUNT,
            AGENT_FEE,
            CAUTION_DEPOSIT
        );
        
        factory.createEscrow(
            tenant,
            landlord,
            agent,
            admin,
            address(token),
            RENT_AMOUNT,
            AGENT_FEE,
            CAUTION_DEPOSIT
        );
    }

    function test_createEscrow_registersInstance_global() public {
        address escrow1 = factory.createEscrow(tenant, landlord, agent, admin, address(token), RENT_AMOUNT, AGENT_FEE, CAUTION_DEPOSIT);
        address escrow2 = factory.createEscrow(stranger, landlord, agent, admin, address(token), RENT_AMOUNT, AGENT_FEE, CAUTION_DEPOSIT);

        assertEq(factory.getEscrowCount(), 2);
        assertEq(factory.getEscrow(0), escrow1);
        assertEq(factory.getEscrow(1), escrow2);
    }

    function test_createEscrow_registersInstance_byTenant() public {
        address escrow1 = factory.createEscrow(tenant, landlord, agent, admin, address(token), RENT_AMOUNT, AGENT_FEE, CAUTION_DEPOSIT);
        address escrow2 = factory.createEscrow(tenant, stranger, agent, admin, address(token), RENT_AMOUNT, AGENT_FEE, CAUTION_DEPOSIT);

        address[] memory tenantEscrows = factory.getEscrowsByTenant(tenant);
        assertEq(tenantEscrows.length, 2);
        assertEq(tenantEscrows[0], escrow1);
        assertEq(tenantEscrows[1], escrow2);

        address[] memory strangerEscrows = factory.getEscrowsByTenant(stranger);
        assertEq(strangerEscrows.length, 0);
    }

    function test_createEscrow_registersInstance_byLandlord() public {
        address escrow1 = factory.createEscrow(tenant, landlord, agent, admin, address(token), RENT_AMOUNT, AGENT_FEE, CAUTION_DEPOSIT);
        address escrow2 = factory.createEscrow(stranger, landlord, agent, admin, address(token), RENT_AMOUNT, AGENT_FEE, CAUTION_DEPOSIT);

        address[] memory landlordEscrows = factory.getEscrowsByLandlord(landlord);
        assertEq(landlordEscrows.length, 2);
        assertEq(landlordEscrows[0], escrow1);
        assertEq(landlordEscrows[1], escrow2);

        address[] memory strangerEscrows = factory.getEscrowsByLandlord(stranger);
        assertEq(strangerEscrows.length, 0);
    }

    function test_getEscrow_revertsIfOutOfBounds() public {
        vm.expectRevert("OgaRentFactory: index out of bounds");
        factory.getEscrow(0);
    }
}

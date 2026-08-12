// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OgaRentFactory.sol";
import "../src/OgaRentEscrow.sol";
import "../src/MockUSDC.sol";

/**
 * @title MultiEscrowTest
 * @notice Validates isolation between multiple child escrow instances.
 */
contract MultiEscrowTest is Test {
    OgaRentFactory public factory;
    MockUSDC public token;

    address admin = makeAddr("admin");
    address agentA = makeAddr("agentA");
    address agentB = makeAddr("agentB");

    address tenantA = makeAddr("tenantA");
    address landlordA = makeAddr("landlordA");

    address tenantB = makeAddr("tenantB");
    address landlordB = makeAddr("landlordB");

    uint256 constant RENT_A = 1000e6;
    uint256 constant FEE_A = 100e6;
    uint256 constant CAUTION_A = 200e6;
    uint256 constant TOTAL_A = RENT_A + FEE_A + CAUTION_A;

    uint256 constant RENT_B = 2000e6;
    uint256 constant FEE_B = 150e6;
    uint256 constant CAUTION_B = 300e6;
    uint256 constant TOTAL_B = RENT_B + FEE_B + CAUTION_B;

    OgaRentEscrow escrowA;
    OgaRentEscrow escrowB;

    function setUp() public {
        token = new MockUSDC();
        factory = new OgaRentFactory();

        token.mint(tenantA, 10000e6);
        token.mint(tenantB, 10000e6);

        address addrA = factory.createEscrow(tenantA, landlordA, agentA, admin, address(token), RENT_A, FEE_A, CAUTION_A);
        address addrB = factory.createEscrow(tenantB, landlordB, agentB, admin, address(token), RENT_B, FEE_B, CAUTION_B);

        escrowA = OgaRentEscrow(addrA);
        escrowB = OgaRentEscrow(addrB);
    }

    function test_isolation_test1_independentAddresses() public view {
        assertTrue(address(escrowA) != address(0));
        assertTrue(address(escrowB) != address(0));
        assertTrue(address(escrowA) != address(escrowB));
    }

    function test_isolation_test2_independentConfiguration() public view {
        IOgaRentEscrow.EscrowConfig memory cfgA = escrowA.getConfig();
        assertEq(cfgA.tenant, tenantA);
        assertEq(cfgA.landlord, landlordA);
        assertEq(cfgA.agent, agentA);
        assertEq(cfgA.rentAmount, RENT_A);

        IOgaRentEscrow.EscrowConfig memory cfgB = escrowB.getConfig();
        assertEq(cfgB.tenant, tenantB);
        assertEq(cfgB.landlord, landlordB);
        assertEq(cfgB.agent, agentB);
        assertEq(cfgB.rentAmount, RENT_B);
    }

    function test_isolation_test3_independentState() public {
        vm.startPrank(tenantA);
        token.approve(address(escrowA), TOTAL_A);
        escrowA.deposit();
        vm.stopPrank();

        assertEq(uint256(escrowA.getState()), uint256(IOgaRentEscrow.EscrowState.Funded));
        assertEq(uint256(escrowB.getState()), uint256(IOgaRentEscrow.EscrowState.Created));
    }

    function test_isolation_test4_independentBalances() public {
        vm.startPrank(tenantA);
        token.approve(address(escrowA), TOTAL_A);
        escrowA.deposit();
        vm.stopPrank();

        assertEq(token.balanceOf(address(escrowA)), TOTAL_A);
        assertEq(token.balanceOf(address(escrowB)), 0);

        vm.startPrank(tenantB);
        token.approve(address(escrowB), TOTAL_B);
        escrowB.deposit();
        vm.stopPrank();

        assertEq(token.balanceOf(address(escrowA)), TOTAL_A);
        assertEq(token.balanceOf(address(escrowB)), TOTAL_B);
    }

    function test_isolation_test5_independentLifecycle() public {
        // Fund both
        vm.prank(tenantA);
        token.approve(address(escrowA), TOTAL_A);
        vm.prank(tenantA);
        escrowA.deposit();

        vm.prank(tenantB);
        token.approve(address(escrowB), TOTAL_B);
        vm.prank(tenantB);
        escrowB.deposit();

        // Occupy A
        vm.prank(tenantA);
        escrowA.confirmOccupancy();

        // Complete A
        vm.warp(block.timestamp + 365 days + 1);
        vm.prank(tenantA);
        escrowA.claimCaution();

        assertEq(uint256(escrowA.getState()), uint256(IOgaRentEscrow.EscrowState.Completed));
        assertEq(token.balanceOf(address(escrowA)), 0);

        // B should still be Funded
        assertEq(uint256(escrowB.getState()), uint256(IOgaRentEscrow.EscrowState.Funded));
        assertEq(token.balanceOf(address(escrowB)), TOTAL_B);
    }

    function test_isolation_test6_independentDisputeLifecycle() public {
        vm.prank(tenantA); token.approve(address(escrowA), TOTAL_A);
        vm.prank(tenantA); escrowA.deposit();

        vm.prank(tenantB); token.approve(address(escrowB), TOTAL_B);
        vm.prank(tenantB); escrowB.deposit();

        // Dispute A
        vm.prank(tenantA); escrowA.raiseDispute();
        assertEq(uint256(escrowA.getState()), uint256(IOgaRentEscrow.EscrowState.Disputed));
        assertEq(uint256(escrowB.getState()), uint256(IOgaRentEscrow.EscrowState.Funded));

        // Resolve A
        vm.prank(admin); escrowA.resolveDispute(true);
        assertEq(uint256(escrowA.getState()), uint256(IOgaRentEscrow.EscrowState.Completed));
        assertEq(uint256(escrowB.getState()), uint256(IOgaRentEscrow.EscrowState.Funded));
    }

    function test_isolation_test7_crossInstanceAuthorization() public {
        vm.prank(tenantA); token.approve(address(escrowA), TOTAL_A);
        vm.prank(tenantA); escrowA.deposit();

        vm.prank(tenantB); token.approve(address(escrowB), TOTAL_B);
        vm.prank(tenantB); escrowB.deposit();

        // Tenant A tries to confirm occupancy for Escrow B
        vm.prank(tenantA);
        vm.expectRevert("OgaRent: not tenant");
        escrowB.confirmOccupancy();
    }

    function test_e2e_factoryToCompletedEscrow() public {
        address tenantC = makeAddr("tenantC");
        address landlordC = makeAddr("landlordC");
        token.mint(tenantC, 5000e6);

        address escrowAddr = factory.createEscrow(tenantC, landlordC, agentA, admin, address(token), RENT_A, FEE_A, CAUTION_A);
        OgaRentEscrow instance = OgaRentEscrow(escrowAddr);

        vm.startPrank(tenantC);
        token.approve(escrowAddr, TOTAL_A);
        instance.deposit();
        assertEq(uint256(instance.getState()), uint256(IOgaRentEscrow.EscrowState.Funded));

        instance.confirmOccupancy();
        assertEq(uint256(instance.getState()), uint256(IOgaRentEscrow.EscrowState.Occupied));
        vm.stopPrank();

        vm.warp(block.timestamp + 365 days + 1);

        vm.prank(tenantC);
        instance.claimCaution();

        assertEq(uint256(instance.getState()), uint256(IOgaRentEscrow.EscrowState.Completed));
        assertEq(token.balanceOf(escrowAddr), 0);
    }
}

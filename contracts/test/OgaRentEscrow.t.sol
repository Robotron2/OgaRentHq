// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/EscrowTestBase.sol";

/**
 * @title OgaRentEscrowTest
 * @notice Test suite for OgaRentEscrow — grows phase by phase.
 *
 * Phase 3: Storage and Initialization tests.
 * Phase 4: Deposit tests (added next phase).
 * Phase 5: Occupancy tests.
 * Phase 6: Caution timelock tests.
 * Phase 7: Dispute lifecycle tests.
 * Phase 8: Security hardening and edge cases.
 */
contract OgaRentEscrowTest is EscrowTestBase {
    // Redeclare events from IOgaRentEscrow for vm.expectEmit usage.
    // Solidity does not allow `emit InterfaceName.EventName(...)` directly.
    // This is the standard Foundry pattern for testing interface events.
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
    event RentDeposited(address indexed tenant, uint256 totalAmount);
    event OccupancyConfirmed(
        address indexed tenant,
        uint256 agentFeeReleased,
        uint256 rentReleased,
        uint256 cautionLocked,
        uint256 occupancyTimestamp
    );
    event DisputeRaised(address indexed raisedBy, IOgaRentEscrow.EscrowState previousState);
    event DisputeResolved(
        address indexed admin,
        address indexed recipient,
        uint256 amount,
        bool paidToLandlord
    );
    event CautionClaimed(address indexed tenant, uint256 amount, uint256 claimedAt);
    // =========================================================================
    // Phase 3 — Initialization
    // =========================================================================

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------

    function test_init_succeeds() public {
        _initialize();

        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Created));

        IOgaRentEscrow.EscrowConfig memory cfg = escrow.getConfig();
        assertEq(cfg.tenant,        tenant);
        assertEq(cfg.landlord,      landlord);
        assertEq(cfg.agent,         agent);
        assertEq(cfg.platformAdmin, admin);
        assertEq(cfg.token,         address(token));
        assertEq(cfg.rentAmount,    RENT_AMOUNT);
        assertEq(cfg.agentFee,      AGENT_FEE);
        assertEq(cfg.cautionDeposit, CAUTION_DEPOSIT);
    }

    function test_init_stateIsCreated() public {
        _initialize();
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Created));
    }

    function test_init_occupancyTimestampIsZero() public {
        _initialize();
        assertEq(escrow.occupancyTimestamp(), 0);
    }

    function test_init_leaseDurationConstant() public {
        _initialize();
        assertEq(escrow.LEASE_DURATION(), 365 days);
    }

    // -------------------------------------------------------------------------
    // Zero-address guards
    // -------------------------------------------------------------------------

    function test_init_revertsOnZeroTenant() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.tenant = address(0);
        vm.expectRevert("OgaRent: zero tenant");
        new OgaRentEscrow(cfg);
    }

    function test_init_revertsOnZeroLandlord() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.landlord = address(0);
        vm.expectRevert("OgaRent: zero landlord");
        new OgaRentEscrow(cfg);
    }

    function test_init_revertsOnZeroAgent() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agent = address(0);
        vm.expectRevert("OgaRent: zero agent");
        new OgaRentEscrow(cfg);
    }

    function test_init_revertsOnZeroAdmin() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.platformAdmin = address(0);
        vm.expectRevert("OgaRent: zero admin");
        new OgaRentEscrow(cfg);
    }

    function test_init_revertsOnZeroToken() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.token = address(0);
        vm.expectRevert("OgaRent: zero token");
        new OgaRentEscrow(cfg);
    }

    // -------------------------------------------------------------------------
    // Zero-amount guards
    // -------------------------------------------------------------------------

    function test_init_revertsOnZeroRentAmount() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.rentAmount = 0;
        vm.expectRevert("OgaRent: zero rent");
        new OgaRentEscrow(cfg);
    }

    function test_init_revertsOnZeroAgentFee() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agentFee = 0;
        vm.expectRevert("OgaRent: zero agent fee");
        new OgaRentEscrow(cfg);
    }

    function test_init_revertsOnZeroCautionDeposit() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.cautionDeposit = 0;
        vm.expectRevert("OgaRent: zero caution");
        new OgaRentEscrow(cfg);
    }

    // -------------------------------------------------------------------------
    // Logical invariant: agentFee must be < rentAmount
    // -------------------------------------------------------------------------

    function test_init_revertsIfAgentFeeEqualsRentAmount() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agentFee = cfg.rentAmount; // equal → revert
        vm.expectRevert("OgaRent: fee >= rent");
        new OgaRentEscrow(cfg);
    }

    function test_init_revertsIfAgentFeeExceedsRentAmount() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agentFee = cfg.rentAmount + 1; // exceeds → revert
        vm.expectRevert("OgaRent: fee >= rent");
        new OgaRentEscrow(cfg);
    }

    function test_init_succeedsWhenAgentFeeIsOneLessThanRentAmount() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agentFee = cfg.rentAmount - 1; // one below → ok
        escrow = new OgaRentEscrow(cfg);
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Created));
    }

    // =========================================================================
    // Phase 4 — Deposit
    // =========================================================================

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------

    function test_deposit_succeeds() public {
        _initialize();

        vm.startPrank(tenant);
        token.approve(address(escrow), TOTAL_DEPOSIT);
        escrow.deposit();
        vm.stopPrank();

        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Funded));
    }

    function test_deposit_transfersExactTokensToEscrow() public {
        _initialize();

        uint256 tenantBefore  = token.balanceOf(tenant);
        uint256 escrowBefore  = token.balanceOf(address(escrow));

        vm.startPrank(tenant);
        token.approve(address(escrow), TOTAL_DEPOSIT);
        escrow.deposit();
        vm.stopPrank();

        assertEq(token.balanceOf(tenant),         tenantBefore - TOTAL_DEPOSIT);
        assertEq(token.balanceOf(address(escrow)), escrowBefore + TOTAL_DEPOSIT);
    }

    function test_deposit_escrowBalanceEqualsTotal() public {
        _initialize();

        vm.startPrank(tenant);
        token.approve(address(escrow), TOTAL_DEPOSIT);
        escrow.deposit();
        vm.stopPrank();

        assertEq(
            token.balanceOf(address(escrow)),
            RENT_AMOUNT + AGENT_FEE + CAUTION_DEPOSIT
        );
    }

    function test_deposit_emitsRentDeposited() public {
        _initialize();

        vm.startPrank(tenant);
        token.approve(address(escrow), TOTAL_DEPOSIT);

        vm.expectEmit(true, false, false, true, address(escrow));
        emit RentDeposited(tenant, TOTAL_DEPOSIT);

        escrow.deposit();
        vm.stopPrank();
    }

    // -------------------------------------------------------------------------
    // Authorization
    // -------------------------------------------------------------------------

    function test_deposit_revertsIfNotTenant_stranger() public {
        _initialize();

        token.mint(stranger, TOTAL_DEPOSIT);
        vm.startPrank(stranger);
        token.approve(address(escrow), TOTAL_DEPOSIT);
        vm.expectRevert("OgaRent: not tenant");
        escrow.deposit();
        vm.stopPrank();
    }

    function test_deposit_revertsIfNotTenant_landlord() public {
        _initialize();

        token.mint(landlord, TOTAL_DEPOSIT);
        vm.startPrank(landlord);
        token.approve(address(escrow), TOTAL_DEPOSIT);
        vm.expectRevert("OgaRent: not tenant");
        escrow.deposit();
        vm.stopPrank();
    }

    function test_deposit_revertsIfNotTenant_admin() public {
        _initialize();

        token.mint(admin, TOTAL_DEPOSIT);
        vm.startPrank(admin);
        token.approve(address(escrow), TOTAL_DEPOSIT);
        vm.expectRevert("OgaRent: not tenant");
        escrow.deposit();
        vm.stopPrank();
    }

    // -------------------------------------------------------------------------
    // State machine
    // -------------------------------------------------------------------------

    function test_deposit_revertsIfDepositedTwice() public {
        _fund(); // advances to Funded via _initialize + deposit

        vm.startPrank(tenant);
        token.approve(address(escrow), TOTAL_DEPOSIT);
        vm.expectRevert("OgaRent: invalid state");
        escrow.deposit();
        vm.stopPrank();
    }

    // -------------------------------------------------------------------------
    // ERC-20 approval
    // -------------------------------------------------------------------------

    function test_deposit_revertsWithoutApproval() public {
        _initialize();

        // No approve() call
        vm.prank(tenant);
        vm.expectRevert();
        escrow.deposit();
    }

    function test_deposit_revertsWithInsufficientApproval() public {
        _initialize();

        vm.startPrank(tenant);
        token.approve(address(escrow), TOTAL_DEPOSIT - 1); // one short
        vm.expectRevert();
        escrow.deposit();
        vm.stopPrank();
    }

    function test_deposit_revertsWithZeroApproval() public {
        _initialize();

        vm.startPrank(tenant);
        token.approve(address(escrow), 0);
        vm.expectRevert();
        escrow.deposit();
        vm.stopPrank();
    }

    function test_deposit_revertsIfTenantHasInsufficientBalance() public {
        // Deploy fresh escrow where tenant has less than total required
        OgaRentEscrow poorEscrow = new OgaRentEscrow(_defaultConfig());

        address poorTenant = makeAddr("poorTenant");
        // Mint only half of what's needed
        token.mint(poorTenant, TOTAL_DEPOSIT / 2);

        vm.startPrank(poorTenant);
        token.approve(address(poorEscrow), TOTAL_DEPOSIT);
        vm.expectRevert();
        poorEscrow.deposit();
        vm.stopPrank();
    }

    // =========================================================================
    // Phase 5 — Occupancy Confirmation
    // =========================================================================

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------

    function test_occupancy_succeeds() public {
        _fund();

        vm.prank(tenant);
        escrow.confirmOccupancy();

        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Occupied));
        assertEq(escrow.occupancyTimestamp(), block.timestamp);
    }

    function test_occupancy_transfersExactTokens() public {
        _fund();

        uint256 agentBefore = token.balanceOf(agent);
        uint256 landlordBefore = token.balanceOf(landlord);
        uint256 escrowBefore = token.balanceOf(address(escrow));

        vm.prank(tenant);
        escrow.confirmOccupancy();

        // Agent gets fee
        assertEq(token.balanceOf(agent), agentBefore + AGENT_FEE);
        // Landlord gets rent
        assertEq(token.balanceOf(landlord), landlordBefore + RENT_AMOUNT);
        // Escrow loses rent + fee
        assertEq(token.balanceOf(address(escrow)), escrowBefore - RENT_AMOUNT - AGENT_FEE);
    }

    function test_occupancy_escrowBalanceEqualsCautionDeposit() public {
        _fund();

        vm.prank(tenant);
        escrow.confirmOccupancy();

        // Only the caution deposit should remain locked
        assertEq(token.balanceOf(address(escrow)), CAUTION_DEPOSIT);
    }

    function test_occupancy_emitsOccupancyConfirmed() public {
        _fund();

        vm.expectEmit(true, false, false, true, address(escrow));
        emit OccupancyConfirmed(
            tenant,
            AGENT_FEE,
            RENT_AMOUNT,
            CAUTION_DEPOSIT,
            block.timestamp
        );

        vm.prank(tenant);
        escrow.confirmOccupancy();
    }

    // -------------------------------------------------------------------------
    // Authorization
    // -------------------------------------------------------------------------

    function test_occupancy_revertsIfNotTenant_stranger() public {
        _fund();
        vm.prank(stranger);
        vm.expectRevert("OgaRent: not tenant");
        escrow.confirmOccupancy();
    }

    function test_occupancy_revertsIfNotTenant_landlord() public {
        _fund();
        vm.prank(landlord);
        vm.expectRevert("OgaRent: not tenant");
        escrow.confirmOccupancy();
    }

    function test_occupancy_revertsIfNotTenant_admin() public {
        _fund();
        vm.prank(admin);
        vm.expectRevert("OgaRent: not tenant");
        escrow.confirmOccupancy();
    }

    // -------------------------------------------------------------------------
    // State machine
    // -------------------------------------------------------------------------

    function test_occupancy_revertsIfNotFunded_Created() public {
        _initialize(); // State is Created
        vm.prank(tenant);
        vm.expectRevert("OgaRent: invalid state");
        escrow.confirmOccupancy();
    }

    function test_occupancy_revertsIfCalledTwice() public {
        _occupy(); // State is Occupied

        vm.prank(tenant);
        vm.expectRevert("OgaRent: invalid state");
        escrow.confirmOccupancy();
    }

    // =========================================================================
    // Phase 6 — Caution Timelock
    // =========================================================================

    // -------------------------------------------------------------------------
    // Timelock Boundaries (LEASE_DURATION = 365 days)
    // -------------------------------------------------------------------------

    function test_claimCaution_beforeExpiry_reverts() public {
        _occupy();
        uint256 occupancyTime = escrow.occupancyTimestamp();

        // One second before expiry
        vm.warp(occupancyTime + 365 days - 1);

        vm.prank(tenant);
        vm.expectRevert("OgaRent: timelock active");
        escrow.claimCaution();
    }

    function test_claimCaution_exactExpiry_reverts() public {
        _occupy();
        uint256 occupancyTime = escrow.occupancyTimestamp();

        // Exactly at expiry (must be strictly greater)
        vm.warp(occupancyTime + 365 days);

        vm.prank(tenant);
        vm.expectRevert("OgaRent: timelock active");
        escrow.claimCaution();
    }

    function test_claimCaution_oneSecondAfterExpiry_succeeds() public {
        _occupy();
        uint256 occupancyTime = escrow.occupancyTimestamp();

        // One second after expiry
        vm.warp(occupancyTime + 365 days + 1);

        vm.prank(tenant);
        escrow.claimCaution();

        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Completed));
    }

    // -------------------------------------------------------------------------
    // Success & Balances
    // -------------------------------------------------------------------------

    function test_claimCaution_transfersCautionToTenant() public {
        _occupy();
        uint256 occupancyTime = escrow.occupancyTimestamp();
        vm.warp(occupancyTime + 365 days + 1);

        uint256 tenantBefore = token.balanceOf(tenant);
        uint256 escrowBefore = token.balanceOf(address(escrow));

        vm.prank(tenant);
        escrow.claimCaution();

        assertEq(token.balanceOf(tenant), tenantBefore + CAUTION_DEPOSIT);
        assertEq(token.balanceOf(address(escrow)), escrowBefore - CAUTION_DEPOSIT);
        assertEq(token.balanceOf(address(escrow)), 0); // Escrow should be empty
    }

    function test_claimCaution_emitsCautionClaimed() public {
        _occupy();
        uint256 occupancyTime = escrow.occupancyTimestamp();
        uint256 claimTime = occupancyTime + 365 days + 1;
        vm.warp(claimTime);

        vm.expectEmit(true, false, false, true, address(escrow));
        emit CautionClaimed(tenant, CAUTION_DEPOSIT, claimTime);

        vm.prank(tenant);
        escrow.claimCaution();
    }

    // -------------------------------------------------------------------------
    // Authorization
    // -------------------------------------------------------------------------

    function test_claimCaution_revertsIfNotTenant_stranger() public {
        _occupy();
        vm.warp(escrow.occupancyTimestamp() + 365 days + 1);

        vm.prank(stranger);
        vm.expectRevert("OgaRent: not tenant");
        escrow.claimCaution();
    }

    function test_claimCaution_revertsIfNotTenant_landlord() public {
        _occupy();
        vm.warp(escrow.occupancyTimestamp() + 365 days + 1);

        vm.prank(landlord);
        vm.expectRevert("OgaRent: not tenant");
        escrow.claimCaution();
    }

    function test_claimCaution_revertsIfNotTenant_admin() public {
        _occupy();
        vm.warp(escrow.occupancyTimestamp() + 365 days + 1);

        vm.prank(admin);
        vm.expectRevert("OgaRent: not tenant");
        escrow.claimCaution();
    }

    // -------------------------------------------------------------------------
    // State machine
    // -------------------------------------------------------------------------

    function test_claimCaution_revertsIfCalledTwice() public {
        _occupy();
        vm.warp(escrow.occupancyTimestamp() + 365 days + 1);

        vm.startPrank(tenant);
        escrow.claimCaution();

        vm.expectRevert("OgaRent: invalid state");
        escrow.claimCaution();
        vm.stopPrank();
    }

    function test_claimCaution_revertsIfNotOccupied_Funded() public {
        _fund(); // State is Funded
        // No occupancy timestamp yet, but warp way into the future just in case
        vm.warp(block.timestamp + 1000 days);

        vm.prank(tenant);
        vm.expectRevert("OgaRent: invalid state");
        escrow.claimCaution();
    }

    // =========================================================================
    // Phase 7 — Dispute Lifecycle
    // =========================================================================

    // -------------------------------------------------------------------------
    // raiseDispute() — Success & Auth
    // -------------------------------------------------------------------------

    function test_raiseDispute_fromFunded_byTenant_succeeds() public {
        _fund();
        vm.prank(tenant);
        escrow.raiseDispute();
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Disputed));
    }

    function test_raiseDispute_fromFunded_byLandlord_succeeds() public {
        _fund();
        vm.prank(landlord);
        escrow.raiseDispute();
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Disputed));
    }

    function test_raiseDispute_fromOccupied_byTenant_succeeds() public {
        _occupy();
        vm.prank(tenant);
        escrow.raiseDispute();
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Disputed));
    }

    function test_raiseDispute_fromOccupied_byLandlord_succeeds() public {
        _occupy();
        vm.prank(landlord);
        escrow.raiseDispute();
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Disputed));
    }

    function test_raiseDispute_emitsDisputeRaised() public {
        _fund();
        vm.expectEmit(true, false, false, true, address(escrow));
        emit DisputeRaised(tenant, IOgaRentEscrow.EscrowState.Funded);
        vm.prank(tenant);
        escrow.raiseDispute();
    }

    function test_raiseDispute_revertsIfStranger() public {
        _fund();
        vm.prank(stranger);
        vm.expectRevert("OgaRent: not tenant or landlord");
        escrow.raiseDispute();
    }

    function test_raiseDispute_revertsIfAdmin() public {
        _fund();
        vm.prank(admin);
        vm.expectRevert("OgaRent: not tenant or landlord");
        escrow.raiseDispute();
    }

    // -------------------------------------------------------------------------
    // resolveDispute() — Success & Auth
    // -------------------------------------------------------------------------

    function test_resolveDispute_revertsIfNotAdmin() public {
        _disputeFromFunded();
        vm.prank(stranger);
        vm.expectRevert("OgaRent: not admin");
        escrow.resolveDispute(true);
    }

    function test_resolveDispute_revertsIfNotDisputed() public {
        _fund(); // Not disputed yet
        vm.prank(admin);
        vm.expectRevert("OgaRent: invalid state");
        escrow.resolveDispute(true);
    }

    // -------------------------------------------------------------------------
    // resolveDispute() — Routing & Balances (from Funded)
    // -------------------------------------------------------------------------
    // If disputed from Funded, escrow holds rentAmount + agentFee + cautionDeposit.

    function test_resolveDispute_fromFunded_paysLandlord() public {
        _disputeFromFunded();
        uint256 landlordBefore = token.balanceOf(landlord);
        
        vm.expectEmit(true, true, false, true, address(escrow));
        emit DisputeResolved(admin, landlord, TOTAL_DEPOSIT, true);

        vm.prank(admin);
        escrow.resolveDispute(true);

        assertEq(token.balanceOf(landlord), landlordBefore + TOTAL_DEPOSIT);
        assertEq(token.balanceOf(address(escrow)), 0);
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Completed));
    }

    function test_resolveDispute_fromFunded_paysTenant() public {
        _disputeFromFunded();
        uint256 tenantBefore = token.balanceOf(tenant);
        
        vm.expectEmit(true, true, false, true, address(escrow));
        emit DisputeResolved(admin, tenant, TOTAL_DEPOSIT, false);

        vm.prank(admin);
        escrow.resolveDispute(false);

        assertEq(token.balanceOf(tenant), tenantBefore + TOTAL_DEPOSIT);
        assertEq(token.balanceOf(address(escrow)), 0);
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Completed));
    }

    // -------------------------------------------------------------------------
    // resolveDispute() — Routing & Balances (from Occupied)
    // -------------------------------------------------------------------------
    // If disputed from Occupied, escrow holds only cautionDeposit.

    function test_resolveDispute_fromOccupied_paysLandlord() public {
        _disputeFromOccupied();
        uint256 landlordBefore = token.balanceOf(landlord);
        
        vm.expectEmit(true, true, false, true, address(escrow));
        emit DisputeResolved(admin, landlord, CAUTION_DEPOSIT, true);

        vm.prank(admin);
        escrow.resolveDispute(true);

        assertEq(token.balanceOf(landlord), landlordBefore + CAUTION_DEPOSIT);
        assertEq(token.balanceOf(address(escrow)), 0);
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Completed));
    }

    function test_resolveDispute_fromOccupied_paysTenant() public {
        _disputeFromOccupied();
        uint256 tenantBefore = token.balanceOf(tenant);
        
        vm.expectEmit(true, true, false, true, address(escrow));
        emit DisputeResolved(admin, tenant, CAUTION_DEPOSIT, false);

        vm.prank(admin);
        escrow.resolveDispute(false);

        assertEq(token.balanceOf(tenant), tenantBefore + CAUTION_DEPOSIT);
        assertEq(token.balanceOf(address(escrow)), 0);
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Completed));
    }

    // -------------------------------------------------------------------------
    // Terminal state replay guards
    // -------------------------------------------------------------------------

    function test_raiseDispute_revertsIfCompleted() public {
        // Run happy path to completion
        _occupy();
        vm.warp(escrow.occupancyTimestamp() + 365 days + 1);
        vm.prank(tenant);
        escrow.claimCaution(); // State is now Completed

        vm.prank(tenant);
        vm.expectRevert("OgaRent: invalid state");
        escrow.raiseDispute();
    }

    function test_resolveDispute_revertsIfCompleted() public {
        // Run dispute path to completion
        _disputeFromFunded();
        vm.prank(admin);
        escrow.resolveDispute(true); // State is now Completed

        vm.prank(admin);
        vm.expectRevert("OgaRent: invalid state");
        escrow.resolveDispute(true);
    }
}

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
        escrow.initialize(_defaultConfig());

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

    function test_init_emitsEscrowInitialized() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();

        vm.expectEmit(true, true, true, true, address(escrow));
        emit EscrowInitialized(
            cfg.tenant,
            cfg.landlord,
            cfg.agent,
            cfg.platformAdmin,
            cfg.token,
            cfg.rentAmount,
            cfg.agentFee,
            cfg.cautionDeposit
        );

        escrow.initialize(cfg);
    }

    function test_init_stateIsCreated() public {
        escrow.initialize(_defaultConfig());
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Created));
    }

    function test_init_occupancyTimestampIsZero() public {
        escrow.initialize(_defaultConfig());
        assertEq(escrow.occupancyTimestamp(), 0);
    }

    function test_init_leaseDurationConstant() public view {
        assertEq(escrow.LEASE_DURATION(), 365 days);
    }

    // -------------------------------------------------------------------------
    // Double initialization guard
    // -------------------------------------------------------------------------

    function test_init_revertsIfCalledTwice() public {
        escrow.initialize(_defaultConfig());
        vm.expectRevert("OgaRent: already initialized");
        escrow.initialize(_defaultConfig());
    }

    function test_init_revertsIfCalledTwiceByStranger() public {
        escrow.initialize(_defaultConfig());
        vm.prank(stranger);
        vm.expectRevert("OgaRent: already initialized");
        escrow.initialize(_defaultConfig());
    }

    // -------------------------------------------------------------------------
    // Zero-address guards
    // -------------------------------------------------------------------------

    function test_init_revertsOnZeroTenant() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.tenant = address(0);
        vm.expectRevert("OgaRent: zero tenant");
        escrow.initialize(cfg);
    }

    function test_init_revertsOnZeroLandlord() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.landlord = address(0);
        vm.expectRevert("OgaRent: zero landlord");
        escrow.initialize(cfg);
    }

    function test_init_revertsOnZeroAgent() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agent = address(0);
        vm.expectRevert("OgaRent: zero agent");
        escrow.initialize(cfg);
    }

    function test_init_revertsOnZeroAdmin() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.platformAdmin = address(0);
        vm.expectRevert("OgaRent: zero admin");
        escrow.initialize(cfg);
    }

    function test_init_revertsOnZeroToken() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.token = address(0);
        vm.expectRevert("OgaRent: zero token");
        escrow.initialize(cfg);
    }

    // -------------------------------------------------------------------------
    // Zero-amount guards
    // -------------------------------------------------------------------------

    function test_init_revertsOnZeroRentAmount() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.rentAmount = 0;
        vm.expectRevert("OgaRent: zero rent");
        escrow.initialize(cfg);
    }

    function test_init_revertsOnZeroAgentFee() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agentFee = 0;
        vm.expectRevert("OgaRent: zero agent fee");
        escrow.initialize(cfg);
    }

    function test_init_revertsOnZeroCautionDeposit() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.cautionDeposit = 0;
        vm.expectRevert("OgaRent: zero caution");
        escrow.initialize(cfg);
    }

    // -------------------------------------------------------------------------
    // Logical invariant: agentFee must be < rentAmount
    // -------------------------------------------------------------------------

    function test_init_revertsIfAgentFeeEqualsRentAmount() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agentFee = cfg.rentAmount; // equal → revert
        vm.expectRevert("OgaRent: fee >= rent");
        escrow.initialize(cfg);
    }

    function test_init_revertsIfAgentFeeExceedsRentAmount() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agentFee = cfg.rentAmount + 1; // exceeds → revert
        vm.expectRevert("OgaRent: fee >= rent");
        escrow.initialize(cfg);
    }

    function test_init_succeedsWhenAgentFeeIsOneLessThanRentAmount() public {
        IOgaRentEscrow.EscrowConfig memory cfg = _defaultConfig();
        cfg.agentFee = cfg.rentAmount - 1; // one below → ok
        escrow.initialize(cfg);
        assertEq(uint256(escrow.getState()), uint256(IOgaRentEscrow.EscrowState.Created));
    }
}

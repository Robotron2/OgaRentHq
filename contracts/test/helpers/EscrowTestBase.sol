// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/OgaRentEscrow.sol";
import "../../src/MockUSDC.sol";

/**
 * @title EscrowTestBase
 * @notice Shared test fixture for all OgaRentEscrow tests.
 *
 * @dev Provides:
 *   - Named test accounts for all four escrow roles plus a stranger
 *   - Deployed MockUSDC and OgaRentEscrow contracts
 *   - Standard escrow amounts matching real-world Nigerian rental scale (6 decimals)
 *   - A pre-built default EscrowConfig
 *   - Helper functions to advance the escrow through lifecycle states
 *
 * Amounts (all in mUSDC atomic units, 6 decimals):
 *   RENT_AMOUNT      = 1,000 mUSDC = 1_000_000_000
 *   AGENT_FEE        =   100 mUSDC =   100_000_000
 *   CAUTION_DEPOSIT  =   200 mUSDC =   200_000_000
 *   TOTAL_DEPOSIT    = 1,300 mUSDC = 1_300_000_000
 *   TENANT_START_BAL = 5,000 mUSDC = 5_000_000_000
 */
contract EscrowTestBase is Test {
    // -------------------------------------------------------------------------
    // Contracts under test
    // -------------------------------------------------------------------------

    OgaRentEscrow internal escrow;
    MockUSDC internal token;

    // -------------------------------------------------------------------------
    // Test accounts
    // -------------------------------------------------------------------------

    address internal admin   = makeAddr("admin");
    address internal tenant  = makeAddr("tenant");
    address internal landlord = makeAddr("landlord");
    address internal agent   = makeAddr("agent");
    address internal stranger = makeAddr("stranger");

    // -------------------------------------------------------------------------
    // Standard amounts (6 decimals — matching real USDC)
    // -------------------------------------------------------------------------

    uint256 internal constant RENT_AMOUNT     = 1_000e6;  // 1,000 mUSDC
    uint256 internal constant AGENT_FEE       =   100e6;  //   100 mUSDC
    uint256 internal constant CAUTION_DEPOSIT =   200e6;  //   200 mUSDC
    uint256 internal constant TOTAL_DEPOSIT   = RENT_AMOUNT + AGENT_FEE + CAUTION_DEPOSIT;
    uint256 internal constant TENANT_START_BAL = 5_000e6; // 5,000 mUSDC

    // -------------------------------------------------------------------------
    // setUp — called before every test
    // -------------------------------------------------------------------------

    function setUp() public virtual {
        // Deploy token
        token  = new MockUSDC();

        // Fund the tenant with test tokens
        token.mint(tenant, TENANT_START_BAL);
    }

    // -------------------------------------------------------------------------
    // Config helpers
    // -------------------------------------------------------------------------

    /// @dev Returns a valid default EscrowConfig using the standard test accounts.
    function _defaultConfig() internal view returns (IOgaRentEscrow.EscrowConfig memory) {
        return IOgaRentEscrow.EscrowConfig({
            tenant:        tenant,
            landlord:      landlord,
            agent:         agent,
            platformAdmin: admin,
            token:         address(token),
            rentAmount:    RENT_AMOUNT,
            agentFee:      AGENT_FEE,
            cautionDeposit: CAUTION_DEPOSIT
        });
    }

    // -------------------------------------------------------------------------
    // Lifecycle helpers — advance escrow to a given state
    // -------------------------------------------------------------------------

    /// @dev Deploys the escrow with the default config.
    function _initialize() internal {
        escrow = new OgaRentEscrow(_defaultConfig());
    }

    /// @dev Initializes, approves, and deposits — advances to Funded.
    function _fund() internal {
        _initialize();
        vm.startPrank(tenant);
        token.approve(address(escrow), TOTAL_DEPOSIT);
        escrow.deposit();
        vm.stopPrank();
    }

    /// @dev Initializes, funds, and confirms occupancy — advances to Occupied.
    function _occupy() internal {
        _fund();
        vm.prank(tenant);
        escrow.confirmOccupancy();
    }

    /// @dev Advances to Disputed from Funded.
    function _disputeFromFunded() internal {
        _fund();
        vm.prank(tenant);
        escrow.raiseDispute();
    }

    /// @dev Advances to Disputed from Occupied.
    function _disputeFromOccupied() internal {
        _occupy();
        vm.prank(tenant);
        escrow.raiseDispute();
    }
}

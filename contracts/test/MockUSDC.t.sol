// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MockUSDC.sol";

contract MockUSDCTest is Test {
    MockUSDC internal token;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    function setUp() public {
        token = new MockUSDC();
    }

    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    function test_name() public view {
        assertEq(token.name(), "Mock USDC");
    }

    function test_symbol() public view {
        assertEq(token.symbol(), "mUSDC");
    }

    function test_decimals() public view {
        assertEq(token.decimals(), 6);
    }

    function test_totalSupply_startsAtZero() public view {
        assertEq(token.totalSupply(), 0);
    }

    // -------------------------------------------------------------------------
    // Minting
    // -------------------------------------------------------------------------

    function test_mint_increasesRecipientBalance() public {
        uint256 amount = 1_000e6; // 1,000 mUSDC
        token.mint(alice, amount);
        assertEq(token.balanceOf(alice), amount);
    }

    function test_mint_increasesTotalSupply() public {
        uint256 amount = 5_000e6;
        token.mint(alice, amount);
        assertEq(token.totalSupply(), amount);
    }

    function test_mint_multipleRecipients() public {
        uint256 amountAlice = 1_000e6;
        uint256 amountBob = 2_500e6;

        token.mint(alice, amountAlice);
        token.mint(bob, amountBob);

        assertEq(token.balanceOf(alice), amountAlice);
        assertEq(token.balanceOf(bob), amountBob);
        assertEq(token.totalSupply(), amountAlice + amountBob);
    }

    function test_mint_isUnrestricted() public {
        // Any address can call mint — no access control
        vm.prank(alice);
        token.mint(alice, 100e6);
        assertEq(token.balanceOf(alice), 100e6);

        vm.prank(bob);
        token.mint(bob, 200e6);
        assertEq(token.balanceOf(bob), 200e6);
    }

    function test_mint_toZeroAddress_reverts() public {
        // OZ ERC20 reverts on mint to the zero address
        vm.expectRevert();
        token.mint(address(0), 100e6);
    }

    // -------------------------------------------------------------------------
    // Transfers (inherited ERC-20 behavior)
    // -------------------------------------------------------------------------

    function test_transfer_sendsTokens() public {
        uint256 mintAmount = 1_000e6;
        uint256 transferAmount = 400e6;

        token.mint(alice, mintAmount);

        vm.prank(alice);
        token.transfer(bob, transferAmount);

        assertEq(token.balanceOf(alice), mintAmount - transferAmount);
        assertEq(token.balanceOf(bob), transferAmount);
    }

    function test_transferFrom_withApproval() public {
        uint256 mintAmount = 1_000e6;
        uint256 approvalAmount = 500e6;

        token.mint(alice, mintAmount);

        vm.prank(alice);
        token.approve(bob, approvalAmount);

        assertEq(token.allowance(alice, bob), approvalAmount);

        vm.prank(bob);
        token.transferFrom(alice, bob, approvalAmount);

        assertEq(token.balanceOf(alice), mintAmount - approvalAmount);
        assertEq(token.balanceOf(bob), approvalAmount);
        assertEq(token.allowance(alice, bob), 0);
    }

    function test_transferFrom_withoutApproval_reverts() public {
        token.mint(alice, 1_000e6);

        vm.prank(bob);
        vm.expectRevert();
        token.transferFrom(alice, bob, 1_000e6);
    }

    function test_transfer_exceedsBalance_reverts() public {
        token.mint(alice, 100e6);

        vm.prank(alice);
        vm.expectRevert();
        token.transfer(bob, 101e6);
    }
}

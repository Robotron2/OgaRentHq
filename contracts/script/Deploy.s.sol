// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OgaRentEscrow.sol";
import "../src/MockUSDC.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy MockUSDC (only needed for testnet, but good for MVP testing)
        MockUSDC mockUSDC = new MockUSDC();
        console.log("MockUSDC deployed at:", address(mockUSDC));

        // 2. Deploy OgaRentEscrow core logic
        OgaRentEscrow escrow = new OgaRentEscrow();
        console.log("OgaRentEscrow deployed at:", address(escrow));

        vm.stopBroadcast();
    }
}

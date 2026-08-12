// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/OgaRentFactory.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC for testing (Remove in production if using real USDC)
        MockUSDC mockUSDC = new MockUSDC();
        console.log("MockUSDC deployed at:", address(mockUSDC));

        // 2. Deploy OgaRentFactory entry point
        OgaRentFactory factory = new OgaRentFactory();
        console.log("OgaRentFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}

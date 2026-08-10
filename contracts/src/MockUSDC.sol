// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice A minimal ERC-20 token representing USDC for the OgaRent hackathon MVP.
 *
 * @dev This contract is intentionally simple:
 *      - 6 decimal places to match real USDC precision.
 *      - An unrestricted `mint` function suitable for demo/testnet use.
 *      - No access control on minting — this is an explicit MVP decision.
 *        In production, real USDC or a properly access-controlled stablecoin would be used.
 *
 * @custom:security-contact security@ogarent.xyz
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    /**
     * @notice Mints `amount` tokens to `to`.
     * @dev Unrestricted — any address may call this on testnet.
     *      This function exists solely for hackathon demo purposes.
     * @param to     The recipient address.
     * @param amount The number of tokens to mint (in atomic units, 6 decimals).
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @notice Returns the number of decimals used for token amounts.
     * @dev Overrides the OZ ERC20 default of 18 to match real USDC (6 decimals).
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

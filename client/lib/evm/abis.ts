import { parseAbi } from 'viem'

export const OgaRentFactoryABI = parseAbi([
  'function createEscrow(address tenant, address landlord, address agent, address platformAdmin, address token, uint256 rentAmount, uint256 agentFee, uint256 cautionDeposit) returns (address)',
  'function getEscrow(uint256 index) view returns (address)',
  'function getEscrowCount() view returns (uint256)',
  'function getEscrowsByLandlord(address landlord) view returns (address[])',
  'function getEscrowsByTenant(address tenant) view returns (address[])',
  'event EscrowCreated(address indexed escrow, address indexed tenant, address indexed landlord, address agent, address platformAdmin, address token, uint256 rentAmount, uint256 agentFee, uint256 cautionDeposit)'
])

export const OgaRentEscrowABI = parseAbi([
  'struct EscrowConfig { address tenant; address landlord; address agent; address platformAdmin; address token; uint256 rentAmount; uint256 agentFee; uint256 cautionDeposit; }',
  'function getConfig() view returns (EscrowConfig)',
  'function getState() view returns (uint8)',
  'function occupancyTimestamp() view returns (uint256)',
  'function LEASE_DURATION() view returns (uint256)',
  'function deposit()',
  'function confirmOccupancy()',
  'function raiseDispute()',
  'function resolveDispute(bool payLandlord)',
  'function claimCaution()',
  'event RentDeposited(address indexed tenant, uint256 totalAmount)',
  'event OccupancyConfirmed(address indexed tenant, uint256 agentFeeReleased, uint256 rentReleased, uint256 cautionLocked, uint256 occupancyTimestamp)',
  'event DisputeRaised(address indexed raisedBy, uint8 previousState)',
  'event DisputeResolved(address indexed admin, address indexed recipient, uint256 amount, bool paidToLandlord)',
  'event CautionClaimed(address indexed tenant, uint256 amount, uint256 claimedAt)'
])

export const MockUSDCABI = parseAbi([
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() pure returns (uint8)',
  'function mint(address to, uint256 amount)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function transferFrom(address from, address to, uint256 value) returns (bool)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
])

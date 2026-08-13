import { Address, parseUnits } from 'viem'

export interface Property {
  id: string
  title: string
  location: string
  neighborhood: string
  description: string
  images: string[]
  propertyType: string
  bedrooms: number
  bathrooms: number
  rentAmount: bigint
  agentFee: bigint
  cautionDeposit: bigint
  landlordAddress: Address
  agentAddress: Address
}

// Deterministic addresses for demo testing purposes
const DEMO_LANDLORD = '0x1111111111111111111111111111111111111111' as Address
const DEMO_AGENT = '0x2222222222222222222222222222222222222222' as Address

export const properties: Property[] = [
  {
    id: 'lekki-2-bed',
    title: 'The Emerald Terraces',
    location: 'Walter Carrington Crescent, VI, Lagos',
    neighborhood: 'Victoria Island',
    description: 'A luxurious 2-bedroom terrace in the heart of Victoria Island. Features a fully fitted kitchen, swimming pool access, and 24/7 security. Perfect for young professionals seeking comfort and proximity to the business district.',
    images: ['/house1.png'],
    propertyType: 'Terrace',
    bedrooms: 2,
    bathrooms: 3,
    rentAmount: parseUnits('8000', 6),       // 8,000 mUSDC (approx 12M NGN)
    agentFee: parseUnits('800', 6),          // 800 mUSDC (10%)
    cautionDeposit: parseUnits('800', 6),    // 800 mUSDC (10%)
    landlordAddress: DEMO_LANDLORD,
    agentAddress: DEMO_AGENT
  },
  {
    id: 'ikeja-3-bed',
    title: 'GRA Serenity Apartments',
    location: 'Isaac John Street, GRA, Ikeja',
    neighborhood: 'Ikeja GRA',
    description: 'Spacious 3-bedroom apartment with a BQ in a serene environment. Includes stable power supply, ample parking space, and close proximity to the airport and major shopping malls.',
    images: ['/house1.png'], // Reusing image since we only have house1.png in public
    propertyType: 'Apartment',
    bedrooms: 3,
    bathrooms: 4,
    rentAmount: parseUnits('5000', 6),
    agentFee: parseUnits('500', 6),
    cautionDeposit: parseUnits('500', 6),
    landlordAddress: DEMO_LANDLORD,
    agentAddress: DEMO_AGENT
  },
  {
    id: 'yaba-1-bed',
    title: 'Tech Hub Studios',
    location: 'Herbert Macaulay Way, Yaba',
    neighborhood: 'Yaba',
    description: 'Modern studio apartment tailored for tech enthusiasts. High-speed internet ready, minimalist design, and co-working spaces on the ground floor. A stone\'s throw from major tech incubators.',
    images: ['/house1.png'],
    propertyType: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    rentAmount: parseUnits('2000', 6),
    agentFee: parseUnits('200', 6),
    cautionDeposit: parseUnits('200', 6),
    landlordAddress: DEMO_LANDLORD,
    agentAddress: DEMO_AGENT
  },
  {
    id: 'ikoyi-4-bed',
    title: 'Banana Island Maisonette',
    location: 'Banana Island Road, Ikoyi',
    neighborhood: 'Ikoyi',
    description: 'Ultra-luxury 4-bedroom maisonette offering panoramic views of the lagoon. Features smart home automation, private elevator, concierge service, and world-class amenities for elite living.',
    images: ['/house1.png'],
    propertyType: 'Maisonette',
    bedrooms: 4,
    bathrooms: 5,
    rentAmount: parseUnits('25000', 6),
    agentFee: parseUnits('2500', 6),
    cautionDeposit: parseUnits('2500', 6),
    landlordAddress: DEMO_LANDLORD,
    agentAddress: DEMO_AGENT
  }
]

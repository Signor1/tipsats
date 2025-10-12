/**
 * Stacks Key Generation
 * Handles Stacks address generation
 */

/**
 * Generate a Stacks testnet address
 * In production, this should use Turnkey to generate and manage keys
 */
export function generateStacksAddress(): string {
  // Generate random testnet address for demo
  // Format: ST + 28 characters from base58 charset
  const prefix = "ST";
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let address = prefix;

  for (let i = 0; i < 28; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return address;
}

/**
 * Validate Stacks address format
 */
export function isValidStacksAddress(address: string): boolean {
  // Testnet addresses start with ST
  // Mainnet addresses start with SP
  // Both are 40 characters total
  const regex = /^(ST|SP)[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{38}$/;
  return regex.test(address);
}

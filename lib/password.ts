import bcrypt from 'bcryptjs';

/**
 * Hashes a plain-text password using bcrypt.
 * 
 * @param password The plain-text password to hash
 * @returns The hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // 12 rounds is a good balance between security and performance
    return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain-text password with a stored bcrypt hash.
 * 
 * @param password The plain-text password to verify
 * @param passwordHash The stored bcrypt hash
 * @returns A boolean indicating whether the password matches the hash
 */
export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}

import CryptoJS from 'crypto-js';

// In Vite, environment variables need to be prefixed with VITE_ to be exposed to the client
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secure-encryption-key-32-characters-long';

if (!ENCRYPTION_KEY) {
  console.warn('No encryption key found. Using a default key. This is not secure for production.');
}

/**
 * Encrypts a string ID using AES encryption
 * @param {string} id - The ID to encrypt
 * @returns {string} Encrypted string
 */
export const encryptId = (id) => {
  try {
    if (!id) throw new Error('No ID provided for encryption');
    const encrypted = CryptoJS.AES.encrypt(id.toString(), ENCRYPTION_KEY).toString();
    // URL-safe encoding
    return encodeURIComponent(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt ID');
  }
};

/**
 * Decrypts an encrypted ID string
 * @param {string} encryptedId - The encrypted ID string
 * @returns {string} Decrypted ID
 */
export const decryptId = (encryptedId) => {
  try {
    if (!encryptedId) throw new Error('No encrypted ID provided');
    // URL-safe decoding
    const decoded = decodeURIComponent(encryptedId);
    const bytes = CryptoJS.AES.decrypt(decoded, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Failed to decrypt ID - invalid key or corrupted data');
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Invalid or corrupted ID');
  }
};

/**
 * Generates a secure random encryption key
 * @returns {string} A secure random key
 */
export const generateEncryptionKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

/**
 * Utility helper functions for the application
 */

// Secret key for encryption (in a real app, this should be stored securely)
const ENCRYPTION_KEY = 'GGM-PRODUCT-SECURE-KEY-2025';

/**
 * Simple XOR encryption for product IDs
 * @param {string|number} id - The product ID to encrypt
 * @returns {string} Base64 encoded encrypted string
 */
export const encryptProductId = (id) => {
  if (!id) return '';
  
  const idStr = String(id);
  let encrypted = '';
  
  for (let i = 0; i < idStr.length; i++) {
    const charCode = idStr.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    encrypted += String.fromCharCode(charCode);
  }
  
  // Convert to base64 for URL safety
  return btoa(encrypted).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Simple XOR decryption for product IDs
 * @param {string} encryptedId - The encrypted product ID
 * @returns {string} Decrypted product ID
 */
export const decryptProductId = (encryptedId) => {
  if (!encryptedId) return '';
  
  try {
    // Restore base64 padding and format
    let base64 = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const encrypted = atob(base64);
    let decrypted = '';
    
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting product ID:', error);
    return '';
  }
};

/**
 * Validates if a decrypted product ID is valid
 * @param {string} id - The decrypted product ID
 * @returns {boolean} True if valid
 */
export const isValidProductId = (id) => {
  if (!id) return false;
  // Check if it's a valid number or string ID
  return /^\d+$/.test(id) || /^[a-fA-F0-9-]+$/.test(id);
};

/**
 * Formats a string by replacing underscores with spaces
 * @param {string} str - The input string to format
 * @returns {string} The formatted string with underscores replaced by spaces
 */
export const formatString = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.replace(/_/g, ' ');
};

/**
 * Formats a string by replacing underscores with spaces and capitalizing the first letter of each word
 * @param {string} str - The input string to format
 * @returns {string} The formatted string with underscores replaced by spaces and proper capitalization
 */
export const formatStringWithCaps = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Converts a string to camelCase
 * @param {string} str - The input string to convert
 * @returns {string} The camelCase version of the string
 */
export const toCamelCase = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/[_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
};

/**
 * Converts a string to snake_case
 * @param {string} str - The input string to convert
 * @returns {string} The snake_case version of the string
 */
export const toSnakeCase = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/\s+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
};

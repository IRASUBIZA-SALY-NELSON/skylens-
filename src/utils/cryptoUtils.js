// Encryption key - must be exactly 32 bytes (256 bits) for AES-256-GCM
// In a production app, this should be stored in environment variables
const ENCRYPTION_KEY_STRING = 'your-secure-encryption-key-32-characters';

// Ensure the key is exactly 32 bytes by hashing it if needed
async function getKeyMaterial() {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY_STRING),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(16), // Fixed salt for key derivation
      iterations: 100000, // High number of iterations for security
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Convert a string to an ArrayBuffer
function stringToArrayBuffer(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Convert an ArrayBuffer to a Base64 string
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert a Base64 string to an ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Encrypt a string
export async function encrypt(plaintext) {
  try {
    const key = await getKeyMaterial();
    
    // Generate a random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      stringToArrayBuffer(plaintext)
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(new Uint8Array(iv), 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to URL-safe Base64
    return arrayBufferToBase64(combined)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

// Decrypt a string
export async function decrypt(encryptedBase64) {
  try {
    const key = await getKeyMaterial();

    // Convert from URL-safe Base64 to standard Base64
    const base64 = encryptedBase64
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Convert from Base64 to ArrayBuffer
    const combined = base64ToArrayBuffer(base64);
    
    // Extract IV (first 12 bytes) and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Decrypt the data
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    // Convert to string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

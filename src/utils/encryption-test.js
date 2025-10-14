// Test file for encryption functionality
import { encryptProductId, decryptProductId, isValidProductId } from './helpers.js';

// Test cases
const testCases = [
  '123',
  '456',
  '789',
  '1001',
  'abc-123-def',
  '550e8400-e29b-41d4-a716-446655440000' // UUID format
];

console.log('Testing encryption and decryption functionality...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test Case ${index + 1}: ${testCase}`);
  
  // Encrypt
  const encrypted = encryptProductId(testCase);
  console.log(`  Encrypted: ${encrypted}`);
  
  // Decrypt
  const decrypted = decryptProductId(encrypted);
  console.log(`  Decrypted: ${decrypted}`);
  
  // Validate
  const isValid = isValidProductId(decrypted);
  console.log(`  Valid: ${isValid}`);
  
  // Check if original matches decrypted
  const matches = testCase === decrypted;
  console.log(`  Matches original: ${matches}`);
  
  console.log('---');
});

console.log('Test completed!');

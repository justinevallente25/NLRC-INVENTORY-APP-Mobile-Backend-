// test-encrypt.js
import { func_Encrypt, func_Decrypt } from "../../utils/encryptPassword.js"; // <- note .js extension

// Test raw password
const raw = "123456";

// Encrypt the raw password
const encrypted = func_Encrypt(raw);

// Simulate DB sample encrypted string
const dbSample = "ÍEÉÇAA"; // replace with your actual encrypted string from DB
const decrypted = func_Decrypt(dbSample);

console.log("Raw password:", raw);
console.log("Encrypted (Node):", encrypted);
console.log("Decrypted (DB sample):", decrypted);

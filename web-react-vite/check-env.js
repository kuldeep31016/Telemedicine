// Quick script to check which environment Vite is using
// Run: node check-env.js

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const envLocalPath = resolve('.env.local');
const envPath = resolve('.env');

console.log('\n🔍 Environment Files Check:\n');
console.log('📁 .env.local exists:', existsSync(envLocalPath) ? '✅ YES' : '❌ NO');
console.log('📁 .env exists:', existsSync(envPath) ? '✅ YES' : '❌ NO');

if (existsSync(envLocalPath)) {
  console.log('\n⭐ Vite will use: .env.local (LOCAL BACKEND)\n');
  const result = config({ path: envLocalPath });
  console.log('   VITE_API_BASE_URL:', result.parsed?.VITE_API_BASE_URL);
} else {
  console.log('\n⭐ Vite will use: .env (DEPLOYED BACKEND)\n');
  const result = config({ path: envPath });
  console.log('   VITE_API_BASE_URL:', result.parsed?.VITE_API_BASE_URL);
}

console.log('\n💡 To switch:\n');
console.log('   Local backend  → Keep .env.local');
console.log('   Deployed backend → Rename .env.local to .env.local.backup\n');

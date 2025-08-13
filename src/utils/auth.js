// utils/auth.js

export async function hashPassword(password) {
  // SHA-256 hashing using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function storeJWT(token) {
  localStorage.setItem('jwt_token', token);
}

export function getJWT() {
  return localStorage.getItem('jwt_token');
}

export function clearJWT() {
  localStorage.removeItem('jwt_token');
}

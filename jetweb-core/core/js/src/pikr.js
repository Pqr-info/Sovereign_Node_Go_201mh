export const PSILen = 32;
export const SFILen = 16;
export const TSILen = 16;
export const QIILen = 32;
export const QRILen = 8;
export const HashLen = 32;

export function newIdentity5(psi, sfi, tsi, qii, qri) {
  if (
    psi.length !== PSILen ||
    sfi.length !== SFILen ||
    tsi.length !== TSILen ||
    qii.length !== QIILen ||
    qri.length !== QRILen
  ) {
    throw new Error("Invalid dimension length for Identity5");
  }
  return { psi, sfi, tsi, qii, qri };
}

import { blake2b } from "blakejs";

async function hashBlake256(data) {
  return blake2b(data, null, HashLen);
}

export async function recoveryMatrix(id) {
  return {
    k1: await hashBlake256(id.psi),
    k2: await hashBlake256(id.sfi),
    k3: await hashBlake256(id.tsi),
    k4: await hashBlake256(id.qii),
    k5: await hashBlake256(id.qri),
  };
}

export async function sovereignKey(rm) {
  const buf = new Uint8Array(HashLen * 5);
  buf.set(rm.k1, 0);
  buf.set(rm.k2, HashLen);
  buf.set(rm.k3, HashLen * 2);
  buf.set(rm.k4, HashLen * 3);
  buf.set(rm.k5, HashLen * 4);
  return hashBlake256(buf);
}

function toHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function shortHex(bytes, n) {
  const h = toHex(bytes);
  return h.slice(0, n);
}

export function identityName(id) {
  return `PI-${shortHex(id.psi, 6)}-${shortHex(id.qri, 2)}`;
}

export function lineageName(id, generation = 0) {
  const gen = Math.max(0, generation).toString().padStart(3, "0");
  return `LN-${shortHex(id.psi, 6)}-${shortHex(id.qii, 4)}-${gen}`;
}

export function recoveryName(dim, k) {
  return `REC-${dim}-${shortHex(k, 4)}`;
}

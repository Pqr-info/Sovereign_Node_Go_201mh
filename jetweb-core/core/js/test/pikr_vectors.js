import fs from "fs";
import path from "path";
import {
  newIdentity5,
  recoveryMatrix,
  sovereignKey,
  identityName
} from "../src/pikr.js";

function hex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function run() {
  const root = path.join(
    process.cwd(),
    "docs",
    "pikr",
    "test_vectors.json"
  );
  console.log("Loading canonical test vectors from:", root);

  const raw = fs.readFileSync(root, "utf8");
  const json = JSON.parse(raw);

  for (const v of json.vectors) {
    const psi = Uint8Array.from(Buffer.from(v.inputs.psi, "hex"));
    const sfi = Uint8Array.from(Buffer.from(v.inputs.sfi, "hex"));
    const tsi = Uint8Array.from(Buffer.from(v.inputs.tsi, "hex"));
    const qii = Uint8Array.from(Buffer.from(v.inputs.qii, "hex"));
    const qri = Uint8Array.from(Buffer.from(v.inputs.qri, "hex"));

    const id = newIdentity5(psi, sfi, tsi, qii, qri);
    const rm = await recoveryMatrix(id);
    const sk = await sovereignKey(rm);

    const out = v.outputs;

    if (hex(rm.k1) !== out.k1) throw new Error("K1 mismatch");
    if (hex(rm.k2) !== out.k2) throw new Error("K2 mismatch");
    if (hex(rm.k3) !== out.k3) throw new Error("K3 mismatch");
    if (hex(rm.k4) !== out.k4) throw new Error("K4 mismatch");
    if (hex(rm.k5) !== out.k5) throw new Error("K5 mismatch");
    if (hex(sk) !== out.sovereignKey) throw new Error("SovereignKey mismatch");

    if (identityName(id) !== out.identityName) {
      throw new Error("IdentityName mismatch");
    }
  }

  console.log("✔ JS 5D-PIKR Coherence Validation Passed Successfully!");
}

run();

// client/scripts/generate-contracts.mjs
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd(); // run this from client/

// --- Config (override via env if your layout differs) ---
const MANIFEST = process.env.DOJO_MANIFEST_PATH
  ?? path.resolve(ROOT, "../aqua_contract/Scarb.toml");
const OUT_DIR = process.env.DOJO_TS_OUT
  ?? path.resolve(ROOT, "src", "typescript");       

const SOZO = process.env.SOZO_BIN || "sozo";
const spawnOpts = { shell: process.platform === "win32", stdio: "inherit" };

// --- 0) Preconditions ---
if (!fs.existsSync(MANIFEST)) {
  console.error(`❌ Manifest not found: ${MANIFEST}
Set DOJO_MANIFEST_PATH or fix the default path.`);
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// --- 1) Generate (try modern bindgen, then legacy build) ---
console.log(`🔧 Generating TypeScript bindings with Sozo…
  manifest: ${MANIFEST}
  out:      ${OUT_DIR}`);

let res = spawnSync(
   SOZO, 
   ["build", "--typescript"], 
  { ...spawnOpts, env: { ...process.env, DOJO_MANIFEST_PATH: MANIFEST, DOJO_TYPESCRIPT_OUT: OUT_DIR } } 
 );

if (res.status !== 0) {
  console.warn("⚠️  'sozo bindgen typescript' failed. Trying legacy 'sozo build --typescript'…");
  // Some older versions honor these env vars for output location.
  res = spawnSync(
    SOZO,
    ["build", "--typescript"],
    {
      ...spawnOpts,
      env: {
        ...process.env,
        DOJO_MANIFEST_PATH: MANIFEST,
        DOJO_TYPESCRIPT_OUT: OUT_DIR,
      },
    }
  );
}

if (res.error) {
  console.error(`❌ Failed to start '${SOZO}': ${res.error.message}`);
  process.exit(1);
}
if (res.status !== 0) {
  console.error(`❌ Code generation exited with ${res.status}`);
  process.exit(res.status ?? 1);
}
console.log("✅ Code generation completed");

// --- 2) Guard (existence + basic type-safety checks) ---
const required = [
  path.join(OUT_DIR, "contracts.gen.ts"),
  path.join(OUT_DIR, "models.gen.ts"),
];

let ok = true;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`[codegen] Missing generated file: ${file}`);
    ok = false;
    continue;
  }
  const txt = fs.readFileSync(file, "utf8");
  if (/@ts-nocheck/.test(txt)) {
    console.error(`[codegen] @ts-nocheck present in: ${file}`);
    ok = false;
  }
  if (/Promise<any>/.test(txt)) {
    console.error(`[codegen] Promise<any> present in: ${file}`);
    ok = false;
  }
  if (/\b:\s*any\b/.test(txt)) {
    console.error(`[codegen] Explicit ': any' present in: ${file}`);
    ok = false;
  }
}
if (!ok) {
  console.error("❌ Generated files failed type-safety checks.");
  process.exit(1);
}

console.log("🎉 Contracts generated and validated successfully!");

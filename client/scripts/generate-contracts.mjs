// client/scripts/generate-contracts.mjs
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_ROOT = path.resolve(__dirname, "..");

if (process.env.SKIP_CODEGEN === "1") {
  console.warn("⚠️  SKIP_CODEGEN=1 set — skipping sozo code generation.");
  process.exit(0);
}

const MANIFEST =
  process.env.DOJO_MANIFEST_PATH ??
  path.resolve(CLIENT_ROOT, "../aqua_contract/Scarb.toml");

const OUT_DIR =
   process.env.DOJO_TS_OUT ??
   process.env.DOJO_TYPESCRIPT_OUT ??
   path.resolve(CLIENT_ROOT, "bindings", "typescript");

const SOZO = process.env.SOZO_BIN || "sozo";
const spawnOpts = {
  cwd: CLIENT_ROOT,
  shell: process.platform === "win32",
  stdio: "inherit",
};

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { encoding: "utf8", stdio: "pipe", ...opts });
}

function hasSozo() {
  const r = run(SOZO, ["--version"], { ...spawnOpts, stdio: "pipe" });
  return r.status === 0;
}

function sozoSupportsBindgen() {
  const r = run(SOZO, ["--help"], { ...spawnOpts, stdio: "pipe" });
  return r.status === 0 && /bindgen/.test(r.stdout || "");
}

function sozoBuildSupportsOutput() {
  const r = run(SOZO, ["build", "--typescript", "--help"], {
    ...spawnOpts,
    stdio: "pipe",
  });
  // If help text includes "--output", we can pass it; otherwise use env var
  return r.status === 0 && /--output/.test(r.stdout || "");
}

// Preconditions
if (!fs.existsSync(MANIFEST)) {
  console.error(`❌ Manifest not found: ${MANIFEST}
Set DOJO_MANIFEST_PATH or fix the default path.`);
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

if (!hasSozo()) {
  console.error("❌ 'sozo' is not available on PATH");
  process.exit(1);
}

console.log(`🔧 Generating TypeScript bindings with Sozo…
  manifest: ${MANIFEST}
  out:      ${OUT_DIR}`);

let status = 0;

// 1) Try bindgen if available
if (sozoSupportsBindgen()) {
  const r = spawnSync(
    SOZO,
    ["bindgen", "typescript", "--manifest-path", MANIFEST, "--output", OUT_DIR],
    spawnOpts
  );
  if (r.status === 0) {
    status = 0;
  } else {
    console.warn(
      "⚠️  'sozo bindgen typescript' failed. Trying legacy 'sozo build --typescript'…"
    );
    status = 1;
  }
} else {
  console.log("ℹ️  This sozo version has no 'bindgen' subcommand; using legacy build.");
  status = 1;
}

// 2) Fallback: build --typescript
if (status !== 0) {
  const canUseOutput = sozoBuildSupportsOutput();
  const args = ["build", "--typescript", "--manifest-path", MANIFEST];
  if (canUseOutput) args.push("--output", OUT_DIR);

  const env = {
    ...process.env,
    // Older sozo uses env var for output
    DOJO_MANIFEST_PATH: MANIFEST,
    DOJO_TYPESCRIPT_OUT: OUT_DIR,
  };

  const r2 = spawnSync(SOZO, args, { ...spawnOpts, env });
  if (r2.status !== 0) {
    console.error("❌ Code generation exited with", r2.status);
    process.exit(r2.status || 1);
  }
}

console.log("✅ Code generation completed");

// Post-gen guards
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

  if (/\/\/\s*@ts-nocheck/.test(txt)) {
    console.error(`[codegen] @ts-nocheck present in: ${file}`);
    ok = false;
  }

  // Strip comments before type checks
  const noComments = txt.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

  if (/\b:\s*any(\W|$)/.test(noComments)) {
    console.error(`[codegen] Explicit ': any' present in: ${file}`);
    ok = false;
  }
  if (/\bPromise\s*<\s*any\s*>/.test(noComments)) {
    console.error(`[codegen] Promise<any> present in: ${file}`);
    ok = false;
  }
}

if (!ok) {
  console.error("❌ Generated files failed type-safety checks.");
  process.exit(1);
}

console.log("🎉 Contracts generated and validated successfully!");
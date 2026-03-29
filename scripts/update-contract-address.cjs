#!/usr/bin/env node
/**
 * Post-deployment script: updates src/config/mtx.ts with the deployed contract address.
 *
 * Usage:
 *   node scripts/update-contract-address.cjs <polygon|amoy>
 *
 * Reads the address from deployments/mtx-<network>.json (saved by deploy_mtx.js)
 * and replaces the zero-address placeholder in src/config/mtx.ts so the live
 * site immediately shows the real contract address even without an env var.
 */

const fs = require("fs");
const path = require("path");

const SUPPORTED_NETWORKS = {
  polygon: "Polygon Mainnet",
  amoy: "Polygon Amoy Testnet",
};

const network = process.argv[2];
if (!network || !Object.prototype.hasOwnProperty.call(SUPPORTED_NETWORKS, network)) {
  console.error("Usage: node update-contract-address.cjs <polygon|amoy>");
  process.exit(1);
}

const networkLabel = SUPPORTED_NETWORKS[network];

const deploymentFile = path.resolve(__dirname, "..", "deployments", `mtx-${network}.json`);

if (!fs.existsSync(deploymentFile)) {
  console.error(`Deployment file not found: ${deploymentFile}`);
  process.exit(1);
}

const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
const { contractAddress, chainId, transactionHash, deploymentTime } = deployment;

if (!contractAddress || !contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
  console.error("Invalid contract address in deployment file:", contractAddress);
  process.exit(1);
}

const configPath = path.resolve(__dirname, "..", "src", "config", "mtx.ts");
let config = fs.readFileSync(configPath, "utf8");

// Replace the zero-address placeholder fallback — must be the exact string used in the template
const PLACEHOLDER_ADDR = "0x0000000000000000000000000000000000000000";
const placeholderPattern = new RegExp(
  `: "${PLACEHOLDER_ADDR}"(;[^\\n]*)?`,
  "g"
);

const matchCount = (config.match(placeholderPattern) || []).length;
if (matchCount === 0) {
  console.error("Could not find placeholder address in src/config/mtx.ts — was it already updated?");
  const match = config.match(/const contractAddress = .+/);
  if (match) console.log("  Current:", match[0]);
  process.exit(1);
}

config = config.replace(
  placeholderPattern,
  `: "${contractAddress}"; // Deployed on ${networkLabel} (${deploymentTime})`
);

// Remove the isPlaceholder console.warn block — anchored to exact known surrounding context
config = config.replace(
  /\nif \(isPlaceholder\) \{\n  console\.warn\([^)]+\);\n  console\.warn\([^)]+\);\n\}\n/,
  "\n"
);

fs.writeFileSync(configPath, config, "utf8");

console.log("✅ Updated src/config/mtx.ts");
console.log("   Network:       ", networkLabel, `(Chain ID: ${chainId})`);
console.log("   Contract:      ", contractAddress);
console.log("   TX hash:       ", transactionHash || "N/A");
console.log("   Deployed at:   ", deploymentTime);

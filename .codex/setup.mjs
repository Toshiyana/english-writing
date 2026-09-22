import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const expectedNodeMajor = readFileSync(
  new URL("../.node-version", import.meta.url),
  "utf8",
).trim();
const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
const expectedPnpmVersion = packageJson.packageManager?.match(/^pnpm@(.+)$/)?.[1];

if (process.versions.node.split(".")[0] !== expectedNodeMajor) {
  console.error(
    `Node.js ${expectedNodeMajor}.x is required, but ${process.version} is active.`,
  );
  process.exit(1);
}

if (!expectedPnpmVersion) {
  console.error("package.json must pin pnpm with the packageManager field.");
  process.exit(1);
}

const pnpmVersionResult = spawnSync("pnpm --version", {
  encoding: "utf8",
  shell: true,
  windowsHide: true,
});

if (pnpmVersionResult.error || pnpmVersionResult.status !== 0) {
  console.error("Unable to determine the active pnpm version.");
  process.exit(1);
}

const activePnpmVersion = pnpmVersionResult.stdout.trim();
if (activePnpmVersion !== expectedPnpmVersion) {
  console.error(
    `pnpm ${expectedPnpmVersion} is required, but ${activePnpmVersion} is active.`,
  );
  process.exit(1);
}

// Using the system shell lets the same command resolve pnpm on Windows,
// macOS, Linux, and WSL. The command is constant and contains no user input.
const result = spawnSync(
  "pnpm install --frozen-lockfile --store-dir=.pnpm-store --config.confirm-modules-purge=false",
  {
    env: { ...process.env, CI: "true" },
    shell: true,
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(`Unable to run pnpm: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`pnpm install failed with exit code ${result.status}.`);
  process.exit(result.status ?? 1);
}

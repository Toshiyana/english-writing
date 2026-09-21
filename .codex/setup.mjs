import { spawnSync } from "node:child_process";

// Using the system shell lets the same command resolve pnpm on Windows,
// macOS, Linux, and WSL. The command is constant and contains no user input.
const result = spawnSync(
  "pnpm install --frozen-lockfile --config.confirm-modules-purge=false",
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

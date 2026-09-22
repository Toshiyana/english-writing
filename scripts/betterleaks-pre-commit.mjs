import { spawnSync } from "node:child_process";

const image =
  "ghcr.io/betterleaks/betterleaks:v1.8.1@sha256:8b9d12db5e11ca798029da44923503de5d8cfff6992cffaaa6722fbeb9fc7797";

function gitPath(option) {
  const result = spawnSync(
    "git",
    ["rev-parse", "--path-format=absolute", option],
    { encoding: "utf8" },
  );

  if (result.error) {
    console.error(`Unable to run git: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  return result.stdout.trim();
}

const repository = gitPath("--show-toplevel");
const gitDirectory = gitPath("--git-dir");
const commonDirectory = gitPath("--git-common-dir");

const result = spawnSync(
  "docker",
  [
    "run",
    "--rm",
    "--volume",
    `${repository}:/repo:ro`,
    "--volume",
    `${gitDirectory}:/git-dir:ro`,
    "--volume",
    `${commonDirectory}:/git-common:ro`,
    "--workdir",
    "/repo",
    "--env",
    "GIT_DIR=/git-dir",
    "--env",
    "GIT_COMMON_DIR=/git-common",
    "--env",
    "GIT_WORK_TREE=/repo",
    image,
    "git",
    "/repo",
    "--pre-commit",
    "--redact",
    "--staged",
    "--verbose",
  ],
  { stdio: "inherit" },
);

if (result.error) {
  console.error(`Unable to run Docker: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);

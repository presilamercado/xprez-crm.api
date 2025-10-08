// cypress.config.js for Cypress v12+ (incl. v13)
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { defineConfig } = require('cypress');
function resolvePythonBinary() {
  const scriptPath = path.join(__dirname, "scripts", "seed_customer.py");
  const explicitBinary = process.env.PYTHON;
  if (explicitBinary) {
    return { pythonExecutable: explicitBinary, scriptPath };
  }

  const venvPython = path.join(__dirname, ".venv", "bin", "python");
  if (fs.existsSync(venvPython)) {
    return { pythonExecutable: venvPython, scriptPath };
  }

  return { pythonExecutable: "python3", scriptPath };
}

function runSeedScript(customerPayload) {
  const { pythonExecutable, scriptPath } = resolvePythonBinary();
  const payloadArg = JSON.stringify(customerPayload);
  const spawnOptions = {
    cwd: __dirname,
    env: { ...process.env, PYTHONPATH: __dirname },
    encoding: "utf-8",
  };

  let result = spawnSync(pythonExecutable, [scriptPath, payloadArg], spawnOptions);

  if (result.error && result.error.code === "ENOENT" && pythonExecutable !== "python") {
    result = spawnSync("python", [scriptPath, payloadArg], spawnOptions);
  }

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    throw new Error(stderr || `Database seed script exited with code ${result.status}`);
  }

  const stdout = (result.stdout || "").trim();
  if (!stdout) {
    throw new Error("Database seed script returned no output");
  }

  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`Unable to parse seed script output: ${stdout}`);
  }
}
module.exports = defineConfig({
  // If not overridden by env (CYPRESS_BASE_URL), this default applies.
  // The GitHub workflow exports CYPRESS_BASE_URL so specs can simply `cy.visit('/')`.
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://127.0.0.1:8000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    projectId: "a5bpri",
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      on('task', {
        "db:insertCustomer": (customerPayload) => runSeedScript(customerPayload),
      });

      return config;
    },
  },
});

// npx cypress run --record --key c7a4fd43-f6be-4c9f-949b-756410d42313
// CYPRESS_RECORD_KEY : c7a4fd43-f6be-4c9f-949b-756410d42313



// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: "http://127.0.0.1:8000", 
//     fixturesFolder: "app/cypress/e2e/fixtures",
//     supportFile: "app/cypress/e2e/fixtures/support/e2e.js",
//     specPattern: "app/cypress/e2e/**/*.cy.js",
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });

const { defineConfig } = require("cypress");
//const JWT = require("./cypress/support/jwt");
//const { ClientCredentialsService } = require("@vygr-npm/cypress-testing-utilities");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:8000",
    supportFile: "cypress/fixtures/support/e2e.js",

    // viewportWidth: 1920,
    // viewportHeight: 1080,
    // pageLoadTimeout: 30000,
    // //projectId: "oqwgrf",
    // experimentalMemoryManagement: true,
    // experimentalRunAllSpecs: true,
    // experimentalStudio: true,
    // retries: {
    //   runMode: 2,
    //   openMode: 0,
    // },
    setupNodeEvents(on, config) {
      config.baseUrl = config.env["BASE_URL"] || config.baseUrl;

      //on("task", JWT(config));
      // on("task", {
      //   getAuthResult() {
      //     const params = {
      //       configuration: {
      //         auth: {
      //           clientId: config.env["VOICE_SERVICE_ENGINE_CLIENT_ID"],
      //           authority: config.env["VOICE_SERVICE_ENGINE_AUTHORITY"],
      //           clientSecret: config.env["VOICE_SERVICE_ENGINE_CLIENT_SECRET"],
      //         },
      //       },
      //       scope: config.env["VOICE_SERVICE_ENGINE_SCOPE"],
      //     };

      // return new Promise((resolve, reject) => {
      //   ClientCredentialsService.getInstance(params)
      //     .authenticate()
      //     .then((result) => resolve(result))
      //     .catch((error) => reject(error));
      // });
      // },
      // });

      return config;
    },
  }
});

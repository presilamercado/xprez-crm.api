// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


/**
 * Fetch a customer by id (preferred) or email via the public API.
 * @param {number|string} identifier - Customer id or email address.
 * @returns {Cypress.Chainable<object>} Resolves with the customer payload.
 */
// Cypress.Commands.add('getCustomerID', (identifier) => {
//   if (identifier === undefined || identifier === null) {
//     throw new Error('getCustomerID requires an id or email argument');
//   }

//   const numericId = Number(identifier);

//   if (!Number.isNaN(numericId)) {
//     return cy
//       .api({
//         url: `/api/v1/customers/${numericId}`,
//         method: 'GET',
//       })
//       .then((response) => {
//         expect(response.status, `customer ${numericId} status`).to.eq(200);
//         expect(response.body).to.include.keys(['id', 'email', 'first_name', 'last_name']);
//         expect(response.body.id).to.eq(numericId);
//         return response.body;
//       });
//   }

//   const email = String(identifier);
//   return cy
//     .api({
//       url: '/api/v1/customers/',
//       method: 'GET',
//     })
//     .then((response) => {
//       expect(response.status, 'customers list status').to.eq(200);
//       const match = response.body.find((customer) => customer.email === email);
//       if (!match) {
//         throw new Error(`No customer found with email ${email}`);
//       }
//       expect(match).to.include.keys(['id', 'email', 'first_name', 'last_name']);
//       return match;
//     });
// });

Cypress.Commands.add(
  "triggerApiRequest",
  (method, endpoint, requestBody, expectedStatus, contentType = "application/json") => {
    const options = {
      failOnStatusCode: false,
      method: method,
      body: requestBody,
      url: endpoint,
      headers: {
        "Content-Type": contentType,
      },
    };
    return cy.api(options).then(function (response) {
      expect(response).to.have.property("headers");
      expect(response).to.have.property("duration");
      expect(response).property("status").to.equal(expectedStatus);
      return response;
    });
  }
);


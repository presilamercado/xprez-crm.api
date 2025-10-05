describe("Integration tests", function () {
  describe("1 Customer CRUD", () => {
    var customerFixture;
    before(() => {
      cy.fixture("customer").then((data) => {
        customerFixture = data;
      });
    });
    it.only("1.1 Create New Customer", () => {
      const seed = customerFixture.createNewCustomer;

      const apiPayload = {
        email: seed.email,
        phone: seed.phone,
        company_name: seed.companyName,
        notes: seed.notes,
        is_active: Boolean(seed.isActive),
      };

      return cy.triggerApiRequest(
        "POST",
        "/api/v1/customers/",
        apiPayload,
        201
      ).then((response) => {
        const responseBody = response.body;
        expect(response.status).to.eq(201);
        expect(responseBody).to.include(apiPayload);
        expect(responseBody).to.have.property("id").that.is.a("number");

        customerFixture.id = responseBody.id;
        return customerFixture.id;
      })
    //   .then((customerId) =>
    //     cy
    //       .triggerApiRequest("DELETE", `/api/v1/customers/${customerId}`, undefined, 204)
    //       .then(() => customerId),
    //   )
    //   .then((customerId) => {
    //     return cy.triggerApiRequest("GET", `/api/v1/customers/${customerId}`, undefined, 404);
      // assertDecision(response, "Approve");
        // GET
    //     cy.triggerApiRequest(
    //     "GET",
    //     Cypress.config("baseUrl") +
    //     `/api/v1/customers//${customerFixture.id}`,
    //     null,
    //    // Cypress.env("API_KEY"),
    //     200
    //     ).then((response) => {
    //       assertDecision(response, "Approve");
    //     });
    //  });
    });

    it.only("1.1 Get Customer by ID", () => {
      return cy.triggerApiRequest(
        "GET",
        "/api/v1/customers/100",
        200
      ).then((response) => {
        const responseBody = response.body;
        expect(response.status).to.eq(200);
     //   expect(responseBody).to.include(apiPayload);
        //expect(responseBody).to.have.property("id").that.is.a("number");

        customerFixture.id = responseBody.id;
        return customerFixture.id;
      })
    //   .then((customerId) =>
    //     cy
    //       .triggerApiRequest("DELETE", `/api/v1/customers/${customerId}`, undefined, 204)
    //       .then(() => customerId),
    //   )
    //   .then((customerId) => {
    //     return cy.triggerApiRequest("GET", `/api/v1/customers/${customerId}`, undefined, 404);
      // assertDecision(response, "Approve");
        // GET
    //     cy.triggerApiRequest(
    //     "GET",
    //     Cypress.config("baseUrl") +
    //     `/api/v1/customers//${customerFixture.id}`,
    //     null,
    //    // Cypress.env("API_KEY"),
    //     200
    //     ).then((response) => {
    //       assertDecision(response, "Approve");
    //     });
    //  });
    });
    
  });
});



//get started :

//`.python3 -m venv .venv`
//source .venv/bin/activate
//database : password : Langga8578

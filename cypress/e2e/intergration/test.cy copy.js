describe("Integration tests", function () {
    describe("1 Decision: APPROVE", () => {
        var customerFixture;
        const buildApiPayload = (fixtureData) => ({
            first_name: fixtureData.firstName,
            last_name: fixtureData.lastName,
            email: fixtureData.email,
            phone: fixtureData.phone,
            company_name: fixtureData.companyName,
            notes: fixtureData.notes,
            is_active: Boolean(fixtureData.isActive),
        });

        before(() => {
            cy.fixture("createNewCustomer").then((data) => {
                customerFixture = data;
            });
        });
        it.only("1.1 Create New Customer", () => {
            const apiPayload = buildApiPayload(customerFixture);

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
            .then((customerId) =>
                cy
                    .triggerApiRequest("DELETE", `/api/v1/customers/${customerId}`, undefined, 204)
                    .then(() => customerId),
            )
            .then((customerId) => {
                return cy.triggerApiRequest("GET", `/api/v1/customers/${customerId}`, undefined, 404);
            });
        });

    });
});

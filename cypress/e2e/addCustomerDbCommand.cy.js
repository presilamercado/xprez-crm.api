describe('addCustomerDB command', () => {
  let createdCustomerId;

  afterEach(() => {
    // if (!createdCustomerId) {
    //   return;
    // }

    cy.api({
      url: `/api/v1/customers/${createdCustomerId}`,
      method: 'DELETE',
      failOnStatusCode: false,
    }).then(() => {
      createdCustomerId = undefined;
    });
  });

  it('inserts a customer directly through the custom command', () => {
    cy.fixture('customer').then((customerFixture) =>
      cy
        .addCustomerDB('customers', customerFixture)
        .then((insertedCustomer) => {
          expect(insertedCustomer).to.have.property('id').that.is.a('number');
          expect(insertedCustomer.email).to.include('@');
          expect(insertedCustomer.first_name).to.not.be.empty;

          createdCustomerId = insertedCustomer.id;
          return insertedCustomer.id;
        })
        .then((customerId) =>
          cy.api({
            url: `/api/v1/customers/${customerId}`,
            method: 'GET',
          }),
        )
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id', createdCustomerId);
          expect(response.body.email).to.be.a('string');
        }),
    );
  });
});

// http://localhost:8000/api/v1/docs#/api/v1/customers/

describe('1 -Database Customer Injection', () => {
  it('inserts a customer directly via the database helper', () => {
    const uniqueSuffix = Date.now();
    const customerPayload = {
      first_name: `db-${uniqueSuffix}`,
      last_name: 'Seeder',
      email: `db-${uniqueSuffix}@example.com`,
      phone: '0279603144',
      company_name: 'SeededCo',
      notes: 'inserted via database task',
      is_active: true,
    };

    cy.task('db:insertCustomer', customerPayload)
      .then((insertedCustomer) => {
        expect(insertedCustomer).to.have.property('id').that.is.a('number');
        expect(insertedCustomer.email).to.eq(customerPayload.email);
        expect(insertedCustomer.first_name).to.eq(customerPayload.first_name);
        return insertedCustomer.id;
      })
      .then((customerId) =>
        cy.api({
          url: `/api/v1/customers/${customerId}`,
          method: 'GET',
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.include(customerPayload);
          return customerId;
        }),
      )
      .then((customerId) =>
        cy.api({
          url: `/api/v1/customers/${customerId}`,
          method: 'DELETE',
        }).then((response) => {
          expect(response.status).to.eq(204);
        }),
      );
  });
});
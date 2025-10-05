// http://localhost:8000/api/v1/docs#/api/v1/customers/

describe('Customer Lifecycle', () => {
  it.only('creates, retrieves, updates, and deletes a customer in one flow', () => {
    const uniqueSuffix = Date.now();
    const customerPayload = {
      first_name: `flow-${uniqueSuffix}`,
      last_name: 'Tester',
      email: `flow-${uniqueSuffix}@example.com`,
      phone: '0279603144',
      company_name: 'LifecycleCo',
      notes: 'end-to-end flow',
      is_active: true,
    };

    const updatedPayload = {
      ...customerPayload,
      first_name: `updated-${uniqueSuffix}`,
      last_name: 'TesterUpdated',
      email: `flow-${uniqueSuffix}-updated@example.com`,
      phone: '0279603146',
      company_name: 'LifecycleCoUpdated',
      notes: 'end-to-end flow updated',
      is_active: true,
    };

    let customerId;

    cy.api({
      url: '/api/v1/customers/',
      method: 'POST',
      body: customerPayload,
    })
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.include(customerPayload);
        expect(response.body).to.have.property('id').that.is.a('number');
        customerId = response.body.id;
      })
      .then(() =>
        cy.api({
          url: `/api/v1/customers/${customerId}`,
          method: 'GET',
        }),
      )
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include(customerPayload);
        expect(response.body.id).to.eq(customerId);
      })
      .then(() =>
        cy.api({
          url: `/api/v1/customers/${customerId}`,
          method: 'PUT',
          body: updatedPayload,
        }),
      )
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include(updatedPayload);
        expect(response.body.id).to.eq(customerId);
      })
      .then(() =>
        cy.api({
          url: `/api/v1/customers/${customerId}`,
          method: 'GET',
        }),
      )
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include(updatedPayload);
        expect(response.body.id).to.eq(customerId);
      })
      .then(() =>
        cy.api({
          url: `/api/v1/customers/${customerId}`,
          method: 'DELETE',
        }),
      )
      .then((response) => {
        expect(response.status).to.eq(204);
      })
      .then(() =>
        cy.api({
          url: `/api/v1/customers/${customerId}`,
          method: 'GET',
          failOnStatusCode: false,
        }),
      )
      .then((response) => {
        expect(response.status).to.eq(404);
      });
  });
});

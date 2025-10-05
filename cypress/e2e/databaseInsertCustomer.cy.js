describe('2 - Inject new record directly in Database', () => {
  let basePayload;
  let uniquePayload;
  let createdCustomerId;

  before(() => {
    cy.fixture('customer').then((customer) => {
      const [localPart, domain] = customer.email.split('@');
      basePayload = {
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: domain ? `${localPart}@${domain}` : customer.email,
        phone: customer.phone,
        company_name: customer.companyName,
        notes: customer.notes,
        is_active: Boolean(customer.isActive),
      };
    });
  });

  after(() => {
    if (!createdCustomerId) {
      return;
    }

    cy.api({
      url: `/api/v1/customers/${createdCustomerId}`,
      method: 'DELETE',
      failOnStatusCode: false,
    }).then(() => {
      createdCustomerId = undefined;
    });
  });

  it('2.1 - Insert New customer in direct in Database', () => {
    cy.then(() => {
      expect(basePayload, 'fixture data loaded').to.exist;

      const uniqueSuffix = Date.now();
      const [localPart, domain] = basePayload.email.split('@');
      const uniqueEmail = domain
        ? `${localPart}+db-${uniqueSuffix}@${domain}`
        : `${basePayload.email}-db-${uniqueSuffix}`;

      uniquePayload = {
        ...basePayload,
        first_name: `${basePayload.first_name}-${uniqueSuffix}`,
        email: uniqueEmail,
      };

      return uniquePayload;
    })
      .then((payload) => cy.task('db:insertCustomer', payload))
      .then((insertedCustomer) => {
        expect(insertedCustomer).to.have.property('id').that.is.a('number');
        expect(insertedCustomer.email).to.eq(uniquePayload.email);
        expect(insertedCustomer.first_name).to.eq(uniquePayload.first_name);
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
        expect(response.body).to.include(uniquePayload);
      });
  });
});

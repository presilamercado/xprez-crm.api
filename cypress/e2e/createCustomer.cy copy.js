// http://localhost:8000/api/v1/docs#/api/v1/customers/

describe('Customers API', () => {
  it('creates a customer and validates the response dynamically', () => {
    const uniqueSuffix = Date.now();
    const customerPayload = {
      first_name: `presila-${uniqueSuffix}`,
      last_name: 'VALDEZ',
      email: `presila-${uniqueSuffix}@example.com`,
      phone: '0279603144',
      company_name: 'valdezCompany',
      notes: 'cypress test',
      is_active: true,
    };

    cy.api({
      url: '/api/v1/customers/',
      method: 'POST',
      body: customerPayload,
    }).then((response) => {
      expect(response.status).to.eq(201);

      expect(response.body).to.include(customerPayload);
      expect(response.body).to.have.property('id').that.is.a('number');
      expect(response.body).to.include.keys(['created_at', 'updated_at']);

      [response.body.created_at, response.body.updated_at].forEach((value) => {
        expect(value, 'timestamp').to.be.a('string');
        expect(Number.isNaN(Date.parse(value)), 'timestamp parseable').to.eq(false);
      });
    });
  });

  it.only('lists customers with the expected structure and known records', () => {
    const knownCustomers = [
      {
        first_name: 'Presila',
        last_name: 'VALDEZ',
        email: 'presilar@example.com',
      },
      {
        first_name: 'Sheila',
        last_name: 'VALDEZ',
        email: 'sheila@example.com',
      },
      {
        first_name: 'SheilaMCMJ',
        last_name: 'VALDEZ',
        email: 'testcypress@gmail.com',
      },
    ];

    cy.api({
      url: '/api/v1/customers/',
      method: 'GET',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body, 'customers list').to.be.an('array').that.is.not.empty;

      response.body.forEach((customer) => {
        expect(customer).to.include.keys([
          'first_name',
          'last_name',
          'email',
          'phone',
          'company_name',
          'notes',
          'is_active',
          'id',
          'created_at',
          'updated_at',
        ]);

        expect(customer.id, 'id').to.be.a('number');
        expect(customer.is_active, 'is_active').to.be.a('boolean');
        [customer.created_at, customer.updated_at].forEach((value) => {
          expect(value, 'timestamp').to.be.a('string');
          expect(Number.isNaN(Date.parse(value)), 'timestamp parseable').to.eq(false);
        });
      });

      knownCustomers.forEach((expected) => {
        const matchExists = response.body.some((customer) =>
          Object.entries(expected).every(([key, value]) => customer[key] === value),
        );

        expect(matchExists, `customer with email ${expected.email} present`).to.eq(true);
      });
    });
  });
});

// http://localhost:8000/api/v1/docs#/api/v1/customers/

describe('Customers API', () => {
  it.only('creates a customer and validates the response dynamically', () => {
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

  it('lists customers with the expected structure and known records', () => {
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

      const presilaRecord = {
        first_name: 'Presila',
        last_name: 'VALDEZ',
        email: 'presilar@example.com',
        phone: '0279603144',
        company_name: 'valdezCompany',
        notes: 'cypress test',
        is_active: true,
        id: 1,
        created_at: '2025-10-05T12:13:11.751210+13:00',
        updated_at: '2025-10-05T12:13:11.751210+13:00',
      };

      expect(response.body).to.deep.include(presilaRecord);

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
        expect(customer.is_active, 'is_active flag').to.be.true;
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

  it("Get one specific customer by Id", () => {
    //lhttp://localhost:8000/api/v1/customers/1'

    cy.api({
      url: '/api/v1/customers/1',
      method: 'GET',
    }).then((response) => {
      expect(response.status).to.eq(200);
      const presilaRecord = {
        first_name: 'Presila',
        last_name: 'VALDEZ',
        email: 'presilar@example.com',
        phone: '0279603144',
        company_name: 'valdezCompany',
        notes: 'cypress test',
        is_active: true,
        id: 1,
        created_at: '2025-10-05T12:13:11.751210+13:00',
        updated_at: '2025-10-05T12:13:11.751210+13:00',
      };
      expect(response.body).to.deep.include(presilaRecord);
    })
  })

  it('Update record 1 - Presila VALDEZ ', () => {
    const customerRecordUpdate = {
      first_name: 'PresilaUPDATE',
      last_name: 'VALDEZZUpdate',
      email: 'presilaUpdate@example.com',
      phone: '0279603146',
      company_name: 'valdezCompanyUPDATE',
      notes: 'string',
      is_active: true,
    };
    cy.api({
      url: '/api/v1/customers/1',
      method: 'PUT',
      body: customerRecordUpdate,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.include(customerRecordUpdate);
      // 
    })
  })
  it('Delete record 1 - Presila VALDEZ ', () => {
    cy.api({
      url: '/api/v1/customers/2',
      method: 'DELETE'
    }).then((response) => {
      expect(response.status).to.eq(204);
    })
  })
});


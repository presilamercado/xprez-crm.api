describe('Customers API', () => {
    var createdNRFixture;
    before(() => {
        cy.fixture("customer").then((data) => {
            createdNRFixture = data;
        })
    })
    it('creates a customer and validates the response dynamically', () => {
        cy.fixture('customer-create').then((basePayload) => {
            const uniqueSuffix = Date.now();
            const uniqueEmail = basePayload.email.includes('@')
                ? basePayload.email.replace('@', `-${uniqueSuffix}@`)
                : `${basePayload.email}-${uniqueSuffix}`;

            const customerPayload = {
                ...basePayload,
                first_name: `${basePayload.first_name}-${uniqueSuffix}`,
                email: uniqueEmail,
            };

            cy.api({
                url: '/api/v1/customers/',
                method: 'POST',
                body: customerPayload,
            })
                .then((response) => {
                    expect(response.status).to.eq(201);

                    expect(response.body).to.include(customerPayload);
                    expect(response.body).to.have.property('id').that.is.a('number');
                    expect(response.body).to.include.keys(['created_at', 'updated_at']);

                    [response.body.created_at, response.body.updated_at].forEach((value) => {
                        expect(value, 'timestamp').to.be.a('string');
                        expect(Number.isNaN(Date.parse(value)), 'timestamp parseable').to.eq(false);
                    });

                    return response.body.id;
                })
                .then((createdId) =>
                    cy.getCustomerID(createdId).then((customer) => {
                        expect(customer.id).to.eq(createdId);
                        expect(customer.email).to.eq(customerPayload.email);
                        expect(customer.first_name).to.eq(customerPayload.first_name);
                        expect(customer.last_name).to.eq(customerPayload.last_name);
                    }),
                );
        });
    });
    it('Get customer number 3 index', () => {
        cy.api({
            url: '/api/v1/customers/',
            method: 'GET',
        })
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.length).to.be.greaterThan(3);
                const targetCustomer = response.body[3];
                expect(targetCustomer, 'customer at index 3 exists').to.be.an('object');
                return targetCustomer;
            })
            .then((targetCustomer) =>
                cy.getCustomerID(targetCustomer.id).then((customer) => {
                    expect(customer.id).to.eq(targetCustomer.id);
                    expect(customer.email).to.eq(targetCustomer.email);
                    expect(customer.first_name).to.eq(targetCustomer.first_name);
                    expect(customer.last_name).to.eq(targetCustomer.last_name);
                }),
            );
    });
    it('Get customer id 46', () => {
        const targetId = 46;
        cy.getCustomerID(targetId).then((customer) => {
            expect(customer.id).to.eq(targetId);
            expect(customer.email).to.be.a('string');
            expect(customer.first_name).to.be.a('string');
            expect(customer.last_name).to.be.a('string');
        });
    });
    it('creates a customer via triggerApiRequest', () => {
        const seed = createdNRFixture.createNewCustomer;
        const uniqueSuffix = Date.now();
        const [localPart, domain] = seed.email.split('@');
        const apiPayload = {
            first_name: `${seed.firstName}-${uniqueSuffix}`,
            last_name: seed.lastName,
            email: domain ? `${localPart}+tr-${uniqueSuffix}@${domain}` : `${seed.email}-tr-${uniqueSuffix}`,
            phone: seed.phone,
            company_name: seed.companyName,
            notes: seed.notes,
            is_active: Boolean(seed.isActive),
        };

        return cy.triggerApiRequest('POST', '/api/v1/customers/', apiPayload, 201)
            .then((response) => {
                expect(response.body).to.include(apiPayload);
                expect(response.body.id, 'created customer id').to.be.a('number');
                return response.body.id;
            })
            .then((customerId) =>
                cy
                    .triggerApiRequest('DELETE', `/api/v1/customers/${customerId}`, undefined, 204)
                    .then(() => customerId),
            )
            .then((customerId) => {
                return cy.triggerApiRequest('GET', `/api/v1/customers/${customerId}`, undefined, 404);
            });
    });
});

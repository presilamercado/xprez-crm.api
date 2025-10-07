// Cypress API tests using the custom command triggerApiRequest(method, endpoint, body, expectedStatus)
//  to create, fetch, update, and delete customers dynamically.
describe('Customers API', () => {
    let customerFixtures;
    before(() => {
        cy.fixture('customer').then((data) => {
            customerFixtures = data;
        });
    });
    it.only('creates, fetches, updates, and revalidates a customer dynamically', () => {
        const uniqueSuffix = Date.now();
        const createSeed = customerFixtures.addNewCustomer;
        const baseUrl = '/api/v1/customers/';

        const createPayload = {
            email: `presila-${uniqueSuffix}@example.com`,
            phone: createSeed.phone,
            company_name: createSeed.company_name || createSeed.companyName,
            notes: createSeed.notes,
            isActive: createSeed.isActive
            // prefer snake_case flag if present on the fixture, otherwise coerce the camelCase variant
            // is_active: Object.prototype.hasOwnProperty.call(createSeed, 'is_active')
            //     ? createSeed.is_active
            //     : Boolean(createSeed.isActive),
        };

        const verifyCustomer = (body, expected) => {
            expect(['string', 'number'], 'customer id type').to.include(typeof body.id);
            expect(body.email).to.eq(expected.email);
            expect(body.phone).to.eq(expected.phone);
            const expectedCompany = expected.company_name ?? expected.companyName;
            if (expectedCompany !== undefined) {
                expect(body.company_name).to.eq(expectedCompany);
            }
            if (expected.notes !== undefined) {
                expect(body.notes).to.eq(expected.notes);
            }
            if (expected.is_active !== undefined || expected.isActive !== undefined) {
                const expectedActive = Object.prototype.hasOwnProperty.call(expected, 'is_active')
                    ? expected.is_active
                    : Object.prototype.hasOwnProperty.call(expected, 'isActive')
                        ? Boolean(expected.isActive)
                        : undefined;
                if (expectedActive !== undefined) {
                    expect(Boolean(body.is_active)).to.eq(Boolean(expectedActive));
                }
            }
        };

        cy.triggerApiRequest('POST', baseUrl, createPayload, 201)
            .then(({ body }) => {
                verifyCustomer(body, createPayload);
                expect(body).to.include.keys(['created_at', 'updated_at']);
                [body.created_at, body.updated_at].forEach((value) => {
                    expect(value, 'timestamp value').to.not.be.undefined;
                    expect(Number.isNaN(Date.parse(String(value))), 'timestamp parseable').to.eq(false);
                });

                return body.id;
            })
            .then((createdId) => {
                const customerUrl = `${baseUrl}${createdId}`;
                return cy
                    .triggerApiRequest('GET', customerUrl, undefined, 200)
                    .then(({ body }) => {
                        verifyCustomer(body, createPayload);
                    })
                    .then(() => {
                        const updateSeed = customerFixtures.updateCustomer || createSeed;
                        const updatePayload = {
                            email: `presila-update-${uniqueSuffix}@example.com`,
                            phone: updateSeed.phone || createPayload.phone,
                            company_name: updateSeed.company_name || updateSeed.companyName,
                            notes: updateSeed.notes ?? createPayload.notes,
                            is_active: Object.prototype.hasOwnProperty.call(updateSeed, 'is_active')
                                ? updateSeed.is_active
                                : Object.prototype.hasOwnProperty.call(updateSeed, 'isActive')
                                    ? Boolean(updateSeed.isActive)
                                    : undefined,
                        };
                        return cy
                            .triggerApiRequest('PUT', customerUrl, updatePayload, 200)
                            .then(({ body }) => {
                                verifyCustomer(body, updatePayload);
                            })
                            .then(() =>
                                cy
                                    .triggerApiRequest('GET', customerUrl, undefined, 200)
                                    .then(({ body }) => {
                                        verifyCustomer(body, updatePayload);
                                    }),
                            )
                            .then(() =>
                                cy.api({
                                    url: customerUrl,
                                    method: 'DELETE',
                                    failOnStatusCode: false,
                                    log: false,
                                }).then((response) => {
                                    expect(response.status).to.eq(204);
                                }),
                            )
                            .then(() =>
                                cy.api({
                                    url: customerUrl,
                                    method: 'GET',
                                    failOnStatusCode: false,
                                    log: false,
                                }).then((response) => {
                                    expect(response.status).to.eq(404);
                                    expect(response.body).to.have.property('detail', 'Customer not found');
                                }),
                            );
                    });

           });
    });
});

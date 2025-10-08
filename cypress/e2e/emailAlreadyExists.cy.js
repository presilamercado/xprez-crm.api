// Negative-path test: prove the API rejects duplicate emails and returns the expected 409 detail payload.
// http://localhost:8000/api/v1/docs#/api/v1/customers/

describe('Customers API', () => {
  it('rejects creation when the email already exists', () => {
    const uniqueSuffix = Date.now();
    const emailAddress = `presila-${uniqueSuffix}@example.com`;
    const basePayload = {
      email: emailAddress,
      phone: '0279603144',
      company_name: 'valdezCompany',
      notes: 'Insert Customer into DB',
      is_active: true,
    };

    cy.api({
      url: '/api/v1/customers/',
      method: 'POST',
      body: basePayload,
    })
      .then((createResponse) => {
        expect(createResponse.status).to.eq(201);
        expect(createResponse.body).to.include(basePayload);
        expect(createResponse.body).to.have.property('id').that.is.a('string');

        return createResponse.body.id;
      })
      .then((createdId) => {
        // attempt to create a second record with the same email and capture the validation error
        return cy
          .api({
            url: '/api/v1/customers/',
            method: 'POST',
            body: basePayload,
            failOnStatusCode: false,
          })
          .then((duplicateResponse) => {
            expect(duplicateResponse.status).to.eq(409);
            expect(duplicateResponse.body).to.have.property(
              'detail',
              'Customer with this email already exists',
            );
          })
          .then(() => createdId);
      })
      .then((createdId) => {
        // clean up the original record so the test can be rerun safely
        return cy.api({
          url: `/api/v1/customers/${createdId}`,
          method: 'DELETE',
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(204);
        });
      });
  });



});



// test ci
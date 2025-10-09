describe('API Test - Verify transportId value', () => {
  it('should fail if transportId does not match DE1K900002', () => {
    cy.api({
      url: 'https://68a6b3d1639c6a54e99f8c13.mockapi.io/api/v1/external_system/transport/1',
      method: 'GET',
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        const actualTransportId = response.body.transportId;
        const expectedTransportId = 'DE1K900002';
        expect(actualTransportId).to.eq(expectedTransportId);
      });
  });
});


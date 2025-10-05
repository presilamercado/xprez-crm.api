// const DEFAULT_TABLE = 'customers';

// function withUniqueEmail(email, uniqueSuffix) {
//   if (!email) {
//     return `db-${uniqueSuffix}@example.com`;
//   }

//   const [localPart, domain] = email.split('@');
//   if (!domain) {
//     return `${email}-db-${uniqueSuffix}`;
//   }

//   return `${localPart}+db-${uniqueSuffix}@${domain}`;
// }

// function buildCustomerPayload(rawData = {}) {
//   const uniqueSuffix = Date.now();
//   const payload = {
//     first_name: rawData.first_name || rawData.firstName || `Auto-${uniqueSuffix}`,
//     last_name: rawData.last_name || rawData.lastNameå || 'Seeder',
//     email: withUniqueEmail(rawData.email, uniqueSuffix),
//     phone: rawData.phone || '0000000000',
//     company_name: rawData.company_name || rawData.companyName || 'SeededCo',
//     notes: rawData.notes || 'Inserted via addCustomerDB command',
//     is_active: Object.prototype.hasOwnProperty.call(rawData, 'is_active')
//       ? rawData.is_active
//       : Object.prototype.hasOwnProperty.call(rawData, 'isActive')
//         ? Boolean(rawData.isActive)
//         : true,
//   };

//   return { payload, uniqueSuffix };
// }

// Cypress.Commands.add('addCustomerDB', (tableName = DEFAULT_TABLE, customerData = {}) => {
//   return cy.then(() => {
//     const { payload } = buildCustomerPayload(customerData);

//     if (tableName && tableName !== DEFAULT_TABLE) {
//       Cypress.log({
//         name: 'addCustomerDB',
//         message: `Ignoring non-customers table name '${tableName}', using default '${DEFAULT_TABLE}'`,
//       });
//     }

//     return payload;
//   })
//     .then((payload) => cy.task('db:insertCustomer', payload))
//     .then((insertedCustomer) => {
//       Cypress.log({
//         name: 'addCustomerDB',
//         message: `Inserted customer ${insertedCustomer.id} (${insertedCustomer.email})`,
//       });

//       return insertedCustomer;
//     });
// });

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("getDataTest", (dataTestSelector) => {
  cy.get(`[data-test=${dataTestSelector}]`);
});

Cypress.Commands.add("getHeaderAndGreeting", (headerGreeting, userGreeting) => {
  cy.getDataTest("header-greeting").should("have.text", headerGreeting);
  cy.getDataTest("user-greeting").should("have.text", userGreeting);
});

Cypress.Commands.add("validateNavigation", (pathname) => {
  cy.visit(pathname);
  cy.getHeaderAndGreeting("Welcome to the Bookinator!", "Not logged in");
  cy.location("pathname").should("eq", pathname);
});

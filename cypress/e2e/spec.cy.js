describe("Server is configured in test mode", () => {
  it("visits the check server mode endpoint", () => {
    cy.visit("http://localhost:4000/testing");
    cy.contains("Server running in test mode");
  });
});
describe("Navigation testing", () => {
  beforeEach(() => {
    it("Header and greeting are correctly displayed on every page", () => {
      cy.getDataTest("header-greeting").hasText("Welcome to the Bookinator!");
      cy.getDataTest("user-greeting").hasText("Not logged in");
    });
  });
  it("Multi-page navigation", () => {
    cy.validateNavigation("/");
    cy.validateNavigation("/books");
    cy.validateNavigation("/login");
    cy.validateNavigation("/register");
  });
});

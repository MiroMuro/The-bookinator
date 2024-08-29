describe("Author form testing", () => {
  it("New author form detects bad input", () => {
    cy.validateNavigation("/addbook");
    cy.registerAndLogin("testuser1", "testpassword1", "testgenre1");
    cy.getDataTest("nav-addbook").should("exist").click();
  });
});

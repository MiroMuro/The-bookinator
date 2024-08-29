describe("Author form testing", () => {
  it("New author form detects bad input", () => {
    cy.validateNavigation("/addbook");
    cy.registerAndLogin("testuser1", "testpassword1", "testgenre1");
    cy.getDataTest("nav-addbook").should("exist").click();
    cy.getDataTest("author-add-button").should("exist").click();
    cy.getDataTest("add-author-dialog").should("exist");
    cy.getDataTest("add-author-form").within(() => {
      cy.get("h2").should("have.text", "Add a new author");

      cy.getDataTest("nameInput").type("a");
      cy.getDataTest("bornInput").click();

      cy.contains("Name must be at least 4 characters long.");

      cy.getDataTest("nameInput").click();
      cy.getDataTest("nameInput").type("testauthor");
      cy.getDataTest("add-author-button").should("be.disabled");
      cy.getDataTest("bornInput").click();

      cy.contains("Name must be at least 4 characters long.").should(
        "not.exist"
      );
      cy.getDataTest("bornInput").type("a");
      cy.getDataTest("add-author-button").click();
      cy.contains("Born year should only contain numbers.");

      cy.getDataTest("bornInput").clear();
      cy.getDataTest("bornInput").type("2025");
      cy.getDataTest("descriptionInput").click();

      cy.contains("Born year cannot be in the future.");

      cy.getDataTest("bornInput").clear();
      cy.getDataTest("bornInput").type("2020");
      cy.getDataTest("descriptionInput").click();

      cy.contains("Born year cannot be in the future.").should("not.exist");

      cy.getDataTest("add-author-button").click();
    });
  });
});

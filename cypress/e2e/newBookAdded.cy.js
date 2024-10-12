describe("Testing the book adding functionality", () => {
  it("Entering an invalid publishment year is prevented with error messages", () => {
    cy.registerAndLogin("testuser-1", "testpassword-1", "testgenre-1");
    cy.getDataTest("nav-addbook").click();
    cy.getDataTest("pubYearInput").type("a");
    cy.getDataTest("pubYearDiv").should(
      "contain.text",
      "Only numbers are allowed."
    );
    cy.getDataTest("pubYearInput").clear();
    cy.getDataTest("pubYearInput").type("2025");
  });
  it("Entering duplicate or too long genres is prevented with error messages", () => {
    cy.LoginAndNavigateTo("testuser-1", "testpassword-1", "/addbook");
    cy.getDataTest("genre-input").type("testgenre-1");
    cy.getDataTest("add-genre-button").click();
    cy.getDataTest("genres-box").should("contain.text", "testgenre-1");
    cy.getDataTest("genre-input").type("testgenre-1");
    cy.getDataTest("duplicate-genre-label").should("be.visible");
    cy.getDataTest("duplicate-genre-label").should(
      "have.text",
      "Duplicate genre!"
    );
    cy.getDataTest("add-genre-button").should("be.disabled");
    cy.getDataTest("genre-input").clear();
    cy.getDataTest("genre-input").type("a".repeat(31));
    cy.getDataTest("too-long-genre-label").should("be.visible");
    cy.getDataTest("too-long-genre-label").should(
      "have.text",
      "Genre name is too long!"
    );
    cy.getDataTest("add-genre-button").should("be.disabled");
  });
  //it("A genre that is too long cant be entered", () => {});
});

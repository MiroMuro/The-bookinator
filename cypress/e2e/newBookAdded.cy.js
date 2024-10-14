describe("Testing the book form validation functionality", () => {
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
    cy.getDataTest("pubYearDiv").should(
      "contain.text",
      "Publish year cannot be in the future."
    );
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
});
describe("Testing the book form submit functionality", () => {
  it.only("A new book can be added by a logged in user", () => {
    cy.registerAndLogin("testuser-1", "testpassword-1", "testgenre-1");
    cy.getDataTest("nav-addbook").click();
    cy.AddAuthorWithDefaultImage(
      "authorOfTestBook",
      "2020",
      "test description for a test author"
    );
    cy.getDataTest("author-select-button").click();
    cy.getDataTest("select-author-button").click();
    cy.getDataTest("ok-button").click();

    cy.getDataTest("selected-author").should("have.text", "authorOfTestBook");

    cy.getDataTest("titleInput").type("testbook 1");
    cy.getDataTest("pubYearInput").clear();
    cy.getDataTest("pubYearInput").type("2023");
    cy.getDataTest("book-descriptionInput").type(
      "test description for a test book"
    );

    cy.getDataTest("genre-input").type("testgenre-1");
    cy.getDataTest("add-genre-button").click();
    cy.getDataTest("genres-box").should("contain.text", "testgenre-1");

    cy.getDataTest("genre-input").type("genre-to-delete");
    cy.getDataTest("add-genre-button").click();
    cy.getDataTest("delete-genre-to-delete-button").click();
    cy.getDataTest("genres-box").should("not.contain.text", "genre-to-delete");

    cy.getDataTest("book-fileInput").attachFile("book.jpg");
    cy.getDataTest("book-file-validation-message").should(
      "have.text",
      "File validated successfully!"
    );
    cy.getDataTest("add-book-button").click();
    cy.getDataTest("book-submit-info-message").should(
      "have.text",
      "testbook 1 by authorOfTestBook was added successfully!"
    );
    cy.getDataTest("nav-books").click();
    cy.getDataTest("book-grid").find("a").should("have.length", 1);
  });
});

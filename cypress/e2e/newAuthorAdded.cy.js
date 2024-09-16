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

      cy.contains("Author cannot be born in the future.");

      cy.getDataTest("bornInput").clear();
      cy.getDataTest("bornInput").type("2020");
      cy.getDataTest("descriptionInput").click();

      cy.contains("Author cannot be born in the future.").should("not.exist");

      cy.getDataTest("fileInput").attachFile("notAImageFile.txt");
      cy.getDataTest("filevalidationMessage").should(
        "have.text",
        "The file is not an image."
      );

      cy.getDataTest("add-author-button").should("be.disabled");
    });
  });
  it("New author can be added by a logged in user", () => {
    cy.validateNavigation("/addbook");
    cy.registerAndLogin("testuser1", "testpassword1", "testgenre1");
    cy.getDataTest("nav-addbook").should("exist").click();
    cy.getDataTest("author-add-button").should("exist").click();
    cy.getDataTest("add-author-dialog").should("be.visible");

    cy.getDataTest("add-author-form").within(() => {
      cy.getDataTest("nameInput").type("testauthor");
      cy.getDataTest("bornInput").type("2020");
      cy.getDataTest("descriptionInput").type(
        "test description for a test author"
      );
      cy.getDataTest("fileInput").attachFile("book.jpg");
      cy.getDataTest("filevalidationMessage").should(
        "have.text",
        "File validated successfully!",
        ""
      );

      cy.getDataTest("add-author-button").click();
    });
    cy.getDataTest("successStatusBar").should("exist");
    cy.getDataTest("successStatusBar").should("have.text", "Status: Success!");
  });
  it.only("New author can be selected in the New Book form", () => {
    cy.validateNavigation("/addbook");
    cy.registerAndLogin("testuser1", "testpassword1", "testgenre1");
    cy.getDataTest("nav-addbook").should("exist").click();
    cy.getDataTest("author-add-button").click();

    cy.getDataTest("add-author-form").within(() => {
      cy.getDataTest("nameInput").type("Harry Saints");
      cy.getDataTest("bornInput").type("1996");
      cy.getDataTest("descriptionInput").type("A test author");
      cy.getDataTest("fileInput").attachFile("testAuthor.jpg");
      cy.getDataTest("filevalidationMessage").should(
        "have.text",
        "File validated successfully!",
        ""
      );
    });
    cy.getDataTest("add-author-button").click();
    cy.getDataTest("successStatusBar").should("exist");
    cy.getDataTest("successStatusBar").should("have.text", "Status: Success!");

    cy.getDataTest("back-button").click();
    cy.getDataTest("author-select-button").click();
    cy.getDataTest("author-search-form").should("exist");
    cy.getDataTest("author-search-form").within(() => {
      cy.getDataTest("author-name").should("have.text", "Name: Harry Saints");
      cy.getDataTest("author-born").should("have.text", "Born: 1996");
      cy.getDataTest("author-books").should("have.text", "Total Books: ");
      cy.getDataTest("select-author-button").click();
    });
    cy.getDataTest("current-author").should("have.text", "Harry Saints");
    cy.getDataTest("ok-button").click();
    cy.getDataTest("selected-author").should("have.text", "Harry Saints");
  });
});

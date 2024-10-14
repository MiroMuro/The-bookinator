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
      cy.getDataTest("submit-author-button").should("be.disabled");
      cy.getDataTest("bornInput").click();

      cy.contains("Name must be at least 4 characters long.").should(
        "not.exist"
      );
      cy.getDataTest("bornInput").type("a");
      cy.getDataTest("bornInput").blur();
      cy.getDataTest("submit-author-button").should("be.disabled");

      cy.contains("Born year should only contain numbers.");

      cy.getDataTest("bornInput").clear();
      cy.getDataTest("bornInput").type("2025");
      cy.getDataTest("author-descriptionInput").click();

      cy.contains("Author cannot be born in the future.");

      cy.getDataTest("bornInput").clear();
      cy.getDataTest("bornInput").type("-1");
      cy.getDataTest("bornInput").blur();

      cy.contains("Author birth year cannot be negative.");

      cy.getDataTest("bornInput").clear();
      cy.getDataTest("bornInput").type("2020");
      cy.getDataTest("author-descriptionInput").click();

      cy.contains("Author cannot be born in the future.").should("not.exist");

      cy.getDataTest("fileInput").attachFile("notAImageFile.txt");
      cy.getDataTest("filevalidationMessage").should(
        "have.text",
        "The file is not an image."
      );

      cy.getDataTest("submit-author-button").should("be.disabled");
    });
  });
  it("New authors can be added by a logged in user", () => {
    cy.validateNavigation("/addbook");
    cy.registerAndLogin("testuser1", "testpassword1", "testgenre1");
    cy.getDataTest("nav-addbook").should("exist").click();
    cy.getDataTest("author-add-button").should("exist").click();
    cy.getDataTest("add-author-dialog").should("be.visible");

    cy.getDataTest("add-author-form").within(() => {
      cy.getDataTest("nameInput").type("testauthor");
      cy.getDataTest("bornInput").type("2020");
      cy.getDataTest("author-descriptionInput").type(
        "test description for a test author"
      );
      cy.getDataTest("fileInput").attachFile("book.jpg");
      cy.getDataTest("filevalidationMessage").should(
        "have.text",
        "File validated successfully!",
        ""
      );

      cy.getDataTest("submit-author-button").click();
    });
    cy.getDataTest("successStatusBar").should("exist");
    cy.getDataTest("successStatusBar").should(
      "have.text",
      "Status: Success! Author testauthor added successfully!"
    );

    cy.getDataTest("back-button").click();

    cy.getDataTest("author-add-button").should("exist").click();
    cy.getDataTest("add-author-dialog").should("be.visible");

    cy.getDataTest("add-author-form").within(() => {
      cy.getDataTest("nameInput").type("Adamn Weathers");
      cy.getDataTest("bornInput").type("1954");
      cy.getDataTest("author-descriptionInput").type(
        "Adam Weathers was a great author of his time."
      );
      cy.getDataTest("fileInput").attachFile("testAuthor.jpg");
      cy.getDataTest("filevalidationMessage").should(
        "have.text",
        "File validated successfully!",
        ""
      );

      cy.getDataTest("submit-author-button").click();
    });

    cy.getDataTest("successStatusBar").should("exist");
    cy.getDataTest("successStatusBar").should(
      "have.text",
      "Status: Success! Author Adamn Weathers added successfully!"
    );
  });
  it("New authors are found and have their own pages", () => {
    cy.validateNavigation("/");
    cy.getDataTest("author0-section").within(() => {
      cy.getDataTest("author-name").should("have.text", "testauthor");
      cy.getDataTest("author-born").should("have.text", "2020");
      cy.getDataTest("author-books").should("have.text", "0");
    });
    cy.getDataTest("author1-section").within(() => {
      cy.getDataTest("author-name").should("have.text", "Adamn Weathers");
      cy.getDataTest("author-born").should("have.text", "1954");
      cy.getDataTest("author-books").should("have.text", "0");
    });
    cy.getDataTest("author0-page").click();
    cy.getDataTest("author-name-header").should("have.text", "testauthor");
    cy.getDataTest("author-info-box").should("exist");
    cy.getDataTest("author-info-box").within(() => {
      cy.contains("Born: 2020");
      cy.contains("Books: 0");
    });
    cy.getDataTest("author-desc-header").should("have.text", "Description:");
    cy.getDataTest("author-desc").should(
      "have.text",
      "test description for a test author"
    );
    cy.getDataTest("author-books-header").should(
      "have.text",
      "Books by this author:"
    );
    cy.getDataTest("author-book-list").should(
      "have.text",
      "No books found by this author"
    );
  });
  it("Selection of addded authors work in New Book Form", () => {
    cy.Login("testuser1", "testpassword1");
    cy.getDataTest("nav-addbook").should("exist").click();
    cy.getDataTest("author-select-button").click();
    cy.getDataTest("authors-div").should("exist");
    cy.getDataTest("authors-div").should("have.length", 2);
    //Select different authors and ensure selected author changes.
    cy.getDataTest("author0-info").within(() => {
      cy.getDataTest("author-name").should("have.text", "Name: testauthor");
      cy.getDataTest("author-born").should("have.text", "Born: 2020");
      cy.getDataTest("author-books").should("have.text", "Total Books: 0");
      cy.getDataTest("select-author-button").click();
    });
    cy.getDataTest("selected-author-header").should(
      "have.text",
      "Selected author:testauthor"
    );
    cy.getDataTest("author1-info").within(() => {
      cy.getDataTest("author-name").should("have.text", "Name: Adamn Weathers");
      cy.getDataTest("author-born").should("have.text", "Born: 1954");
      cy.getDataTest("author-books").should("have.text", "Total Books: 0");
      cy.getDataTest("select-author-button").click();
    });
    cy.getDataTest("selected-author-header").should(
      "have.text",
      "Selected author:Adamn Weathers"
    );
    cy.getDataTest("ok-button").click();
    cy.getDataTest("selected-author").should("have.text", "Adamn Weathers");
    cy.getDataTest("author-clear-button").click();
    cy.getDataTest("selected-author").should("not.have.text");
  });
});

describe("Server is configured in test mode", () => {
  it("visits the check server mode endpoint", () => {
    cy.visit("http://localhost:4000/testing");
    cy.contains("Server running in test mode");
  });
});
describe("Navigation testing", () => {
  it("Multi-page navigation", () => {
    cy.validateNavigation("/");
    cy.validateNavigation("/books");
    cy.validateNavigation("/login");
    cy.validateNavigation("/register");
  });
  it("Authors and Books render correctly empty and interaction with the page doesn't break the app", () => {
    cy.validateNavigation("/");
    cy.getDataTest("no-authors-div").should(
      "have.text",
      "No authors added yet."
    );
    cy.getDataTest("author-filter-div").within(() => {
      cy.get("input").type("test test test");
    });
    cy.getDataTest("no-authors-div").should(
      "have.text",
      "No authors added yet."
    );
    cy.validateNavigation("/books");
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");
    //Genres dropdown tests
    cy.getDataTest("genres-dropdown").within(() => {
      cy.get("div").should("have.text", " No genre selected");
      cy.getDataTest("genre-dropdown").should("have.length", 1);
      cy.getDataTest("genre-dropdown")
        .its(0)
        .should("have.value", "-- Choose genre --");
      cy.getDataTest("genre-dropdown").select(0);
      cy.get("div").should("have.text", " No genre selected");
      cy.getDataTest("reset-filter-button").click();
      cy.get("div").should("have.text", " No genre selected");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");
    //Sorting mechanism tests
    cy.getDataTest("books-sorting-div").within(() => {
      cy.getDataTest("sort-menu").get("option").should("have.length", 4);
      cy.getDataTest("sort-menu")
        .find("option")
        .should((options) => {
          const expectedOptions = [
            "Select sort criteria",
            "Title",
            "Author",
            "Published",
          ];
          const actualOptions = Array.from(options).map(
            (option) => option.textContent
          );
          expect(actualOptions).to.deep.equal(expectedOptions);
        });
    });
    cy.getDataTest("books-sorting-div").within(() => {
      cy.getDataTest("sort-menu").get("option").its(0).should("be.disabled");
      cy.getDataTest("sort-menu").select("Title");
      cy.getDataTest("sort-menu").should("have.value", "title");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");

    cy.getDataTest("books-sorting-div").within(() => {
      cy.getDataTest("sort-menu").select("Author");
      cy.getDataTest("sort-menu").should("have.value", "author");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");
    cy.getDataTest("books-sorting-div").within(() => {
      cy.getDataTest("sort-menu").select("Published");
      cy.getDataTest("sort-menu").should("have.value", "published");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");
    cy.getDataTest("books-sorting-div").within(() => {
      cy.getDataTest("sort-button").click();
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");
    cy.getDataTest("books-sorting-div").within(() => {
      cy.getDataTest("sort-button").click();
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");
    //Book search tests
    cy.getDataTest("books-searchbar-div").within(() => {
      cy.get("label").should("have.text", "Search title: ");
      cy.getDataTest("search-bar").type("test test test");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");
    //Book pagination tests
    cy.getDataTest("books-pagination-nav").within(() => {
      //No pagination buttons
      cy.get("ul").get("button").should("have.length", 0);
      //Can select amount of books per page

      cy.getDataTest("books-per-page-select").select("8");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");

    cy.getDataTest("books-pagination-nav").within(() => {
      cy.getDataTest("books-per-page-select").select("16");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");

    cy.getDataTest("books-pagination-nav").within(() => {
      cy.getDataTest("books-per-page-select").select("24");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");

    cy.getDataTest("books-pagination-nav").within(() => {
      cy.getDataTest("books-per-page-select").select("32");
    });
    cy.getDataTest("no-books-div").should("have.text", "No books added yet.");
  });
});

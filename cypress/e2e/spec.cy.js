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
  it("Authors and Books behave correctly not logged in and empty.", () => {
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
  it("Registration works correctly", () => {
    cy.validateNavigation("/register");
    cy.contains("Register here!");
    cy.getDataTest("register-button").should("be.disabled"); //Submit button is disabled
    cy.getDataTest("register-form").within(() => {
      //Username tests
      cy.getDataTest("username-div").within(() => {
        cy.contains("Username");
        cy.getDataTest("username-error")
          .should("be.visible")
          .and("have.text", "Username invalid!");
        //usename min length is 3
        cy.get("input").type("aa");
        cy.getDataTest("username-error")
          .should("be.visible")
          .and("have.text", "Username invalid!");
        cy.get("input").clear();
        cy.get("input").type("testUser1");
        cy.getDataTest("username-error").should("not.be.visible");
      });
      cy.getDataTest("register-button").should("be.disabled"); //Submit button is disabled

      //Password tests
      cy.getDataTest("password-div").within(() => {
        cy.contains("Password");
        cy.getDataTest("password-error")
          .should("be.visible")
          .and("have.text", "Password invalid!");
        //Password too short (Min. 8 characters)
        cy.get("input").type("tooshrt");
        cy.getDataTest("password-error")
          .should("be.visible")
          .and("have.text", "Password invalid!");
        cy.get("input").clear();
        //Password is good
        cy.get("input").type("testPassword1");
        cy.getDataTest("password-error").should("not.be.visible");
      });

      //Repeat password tests
      cy.getDataTest("register-button").should("be.disabled"); //Submit button is disabled
      cy.getDataTest("repeat-password-div").within(() => {
        cy.contains("Repeat password");
        cy.getDataTest("repeat-password-error")
          .should("be.visible")
          .and("have.text", "Passwords do not match!");
        cy.get("input").type("testPassword1");
        cy.getDataTest("repeat-password-error").should("not.be.visible");
      });
      cy.getDataTest("register-button").should("be.disabled"); //Submit button is disabled

      //Genre test
      cy.getDataTest("favorite-genre-div").within(() => {
        cy.contains("Favorite genre");
        //Genre min length is 3 characters
        cy.get("input").type("aa");
        cy.getDataTest("favorite-genre-error")
          .should("be.visible")
          .and("have.text", "Genre invalid!");
        cy.get("input").clear();
        //Genre max length is 3 characters
        cy.get("input").type(
          "thistestgenrenameistoolongandtheerrorshouldshowup"
        );
        cy.getDataTest("favorite-genre-error")
          .should("be.visible")
          .and("have.text", "Genre invalid!");
        cy.get("input").clear();
        //Genre is good
        cy.get("input").type("Thriller");
        cy.getDataTest("favorite-genre-error").should("not.be.visible");
      });
      cy.getDataTest("register-button").should("not.be.disabled"); //Submit button is disabled
      cy.getDataTest("register-button").click();
    });
    cy.contains("Registration successful! Redirecting to login...").as(
      "registrationSuccess"
    );
    cy.validateNavigation("/login");
  });
  it("Registration fails with duplicate username", () => {
    cy.validateNavigation("/register");
    cy.getDataTest("register-form").within(() => {
      cy.getDataTest("username-div").within(() => {
        cy.get("input").type("testUser1");
      });
      cy.getDataTest("password-div").within(() => {
        cy.get("input").type("testPassword1");
      });
      cy.getDataTest("repeat-password-div").within(() => {
        cy.get("input").type("testPassword1");
      });
      cy.getDataTest("favorite-genre-div").within(() => {
        cy.get("input").type("Thriller");
      });
      cy.getDataTest("register-button").click();
    });
    cy.contains("Username testUser1 already taken. Please try another one.");
  });
});

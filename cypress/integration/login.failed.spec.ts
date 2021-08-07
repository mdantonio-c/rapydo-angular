// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("FailedLogin", () => {
  beforeEach(() => {
    cy.visit("/app/profile");

    // Close the cookie law banner
    cy.get('button:contains("Ok, got it")').click();

    // Profile page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    // The URL contain a reference to the previous page (/app/profile)
    cy.url().should("include", "/app/login");
    cy.url().should("include", "?returnUrl=%2Fapp%2Fprofile");
    cy.get("div.card-header h4").contains("Login");
  });

  it("Login - missing or wrong credentials", () => {
    // Missing credentials
    cy.get("input[placeholder='Your username (email)']");
    cy.get("input[placeholder='Your password']");
    cy.get("button").contains("Login").click();
    cy.get("formly-validation-message").contains("This field is required");

    // Providing a non-email username
    cy.get("input[placeholder='Your username (email)']")
      .clear()
      .type("invalid");
    cy.get("button").contains("Login").click();
    cy.get("formly-validation-message").contains("Invalid email address");

    // Username is good, password is missing
    cy.get("input[placeholder='Your username (email)']")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("button").contains("Login").click();
    cy.get("formly-validation-message").contains("This field is required");

    // Username is good, password is wrong
    cy.get("input[placeholder='Your password']").clear().type("invalid");
    cy.get("button").contains("Login").click();
    cy.checkalert("Invalid username or password");

    // Password is good, username is wrong
    cy.get("input[placeholder='Your username (email)']")
      .clear()
      .type("invalid@user.name");
    cy.get("input[placeholder='Your password']")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Login").click();
    cy.checkalert("Invalid username or password");
  });

  afterEach(() => {
    // You are still on the login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });
});

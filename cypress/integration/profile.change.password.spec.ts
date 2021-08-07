// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../../fixtures/utilities";

describe("ChangePassword", () => {
  const email = "aaaaaaaaaa000111@sample.org";
  let pwd = getpassword(4);

  beforeEach(() => {
    cy.login();

    cy.createuser(email, pwd);

    cy.logout();
  });

  it("ChangePassword", () => {
    cy.visit("/app/login");
    cy.closecookielaw();

    cy.intercept("POST", "/auth/login").as("login");

    cy.get("input[placeholder='Your username (email)']").clear().type(email);
    cy.get("input[placeholder='Your password']").clear().type(pwd);
    cy.get("button").contains("Login").click();

    cy.wait("@login");

    if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === "True") {
      cy.get("div.card-header")
        .should("have.class", "bg-warning")
        .find("h4")
        .contains("Please change your temporary password");

      cy.checkalert("Please change your temporary password");

      pwd = pwd + "!";

      cy.intercept("POST", "/auth/login").as("changed");

      cy.get('input[placeholder="Your new password"]').clear().type(pwd);
      cy.get('input[placeholder="Confirm your new password"]')
        .clear()
        .type(pwd);
      cy.get('button:contains("Change")').click({ force: true });

      cy.wait("@changed");
    }

    cy.visit("/app/profile/changepassword");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    // Go back
    cy.get("button:contains('Cancel')").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.get("a:contains('CHANGE')").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    cy.get("button:contains('Submit')").click();
    cy.checkvalidation(0, "This field is required");

    cy.get('input[placeholder="Type here your current password"]').as(
      "password"
    );
    cy.get('input[placeholder="Type the desidered new password"]').as(
      "new_password"
    );
    cy.get(
      'input[placeholder="Type again the new password for confirmation"]'
    ).as("confirm_password");

    cy.get("@password").clear().type("wrong");
    cy.get("@new_password").clear().type("short");
    cy.get("@confirm_password").clear().type("short");
    cy.checkvalidation(
      0,
      "Should have at least " +
        Cypress.env("AUTH_MIN_PASSWORD_LENGTH") +
        " characters"
    );

    let newPassword = getpassword(1);
    cy.get("@password").clear().type("short");
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(getpassword(1));
    cy.checkvalidation(0, "The password does not match");
    cy.get("@confirm_password").clear().type(newPassword);

    cy.get("button:contains('Submit')").click();
    cy.checkalert(
      "Shorter than minimum length " +
        Cypress.env("AUTH_MIN_PASSWORD_LENGTH") +
        "."
    );
    cy.get("@password").clear().type(getpassword(4));

    cy.get("button:contains('Submit')").click();
    cy.checkalert(
      "Your request cannot be authorized, is current password wrong?"
    );

    cy.get("@password").clear().type(pwd);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing upper case letters");

    cy.get("@new_password").clear().type(newPassword.toUpperCase());
    cy.get("@confirm_password").clear().type(newPassword.toUpperCase());
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing lower case letters");

    newPassword = getpassword(2);
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(newPassword);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing numbers");

    newPassword = getpassword(3);
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(newPassword);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing special characters");

    cy.get("@new_password").clear().type(pwd);
    cy.get("@confirm_password").clear().type(pwd);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("The new password cannot match the previous password");

    newPassword = getpassword(4);
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(newPassword);

    // Check backend errors

    // How to only execute this intercept once?
    // After this the normal workflow should continue...
    // cy.intercept("PUT", "/auth/profile", {
    //   statusCode: 500,
    //   body: "Stubbed change password error",
    // }).as("put");

    // cy.get("button:contains('Submit')").click();
    // cy.wait("@put");
    // cy.checkalert("Stubbed change password error");
    // this is needed to completely removed from the DOM the previous stubbed alert
    // Otherwise the check will fail because it will refer to the previous one
    // cy.wait(200);

    cy.intercept("POST", "/auth/login").as("login2");

    cy.get("button:contains('Submit')").click();

    cy.wait("@login2");

    cy.checkalert("Password successfully changed");

    cy.visit("/app/profile");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });
    cy.get("table").find("td").contains(email);
  });

  afterEach(() => {
    cy.logout();

    cy.login();
    cy.deleteuser(email);
  });
});

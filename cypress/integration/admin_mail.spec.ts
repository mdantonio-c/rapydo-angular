// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminMail", () => {
  it("Test sendmail", () => {
    cy.login();

    cy.visit("/app/admin/mail");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/mail");
    });

    cy.get("div.card-header h4").contains("Admin send mail");

    // Why this wait!??!? Without this the form is sent before the validation :o
    cy.wait(100);

    cy.get("div.card-body")
      .find("button:contains('Send mail')")
      .click({ force: true });
    cy.checkvalidation(0, "This field is required");
    cy.checkvalidation(1, "This field is required");
    cy.checkvalidation(2, "This field is required");

    cy.get('input[placeholder="Subject of your email"]')
      .clear()
      .type("Your subject");
    // It should work because there is only 1 textarea
    cy.get("textarea").clear().type("Your <b>body</b>!");
    cy.get('input[placeholder="Destination email address"]')
      .clear()
      .type("Your email");

    cy.get("div.card-body")
      .find("button:contains('Send mail')")
      .click({ force: true });
    cy.checkvalidation(0, "Invalid email address");

    cy.get('input[placeholder="Destination email address"]')
      .clear()
      .type("sample@nomail.org");
    cy.get("div.card-body")
      .find("button:contains('Send mail')")
      .click({ force: true });

    cy.checkalert("Mail successfully sent");

    cy.get("div.card-body").contains(
      "Your email with subject: Your subject has been successfully sent!"
    );
    cy.get("div.card-body").contains("Destination address: sample@nomail.org");

    cy.get("div.card-footer").contains("Do you want to send a new email?");
    cy.get("div.card-footer")
      .find("a:contains('Send new email')")
      .click({ force: true });

    cy.get('input[placeholder="Subject of your email"]')
      .clear()
      .type("Your subject");
    // It should work because there is only 1 textarea
    cy.get("textarea").clear().type("Your <b>body</b>!");
    cy.get('input[placeholder="Destination email address"]')
      .clear()
      .type("sample@nomail.org");

    cy.get('input[placeholder="CC email addresses (comma-delimited list)"]')
      .clear()
      .type("Your email");
    cy.get('input[placeholder="BCC email addresses (comma-delimited list)"]')
      .clear()
      .type("Your email");

    cy.get("div.card-body")
      .find("button:contains('Send mail')")
      .click({ force: true });

    // cy.checkalert("Non a valid email address.");
    // cy.checkalert("Non a valid email address.");

    cy.get('input[placeholder="CC email addresses (comma-delimited list)"]')
      .clear()
      .type("sample1@nomail.org,sample2");
    cy.get('input[placeholder="BCC email addresses (comma-delimited list)"]')
      .clear()
      .type("sample3@nomail.org,sample4");

    cy.get("div.card-body")
      .find("button:contains('Send mail')")
      .click({ force: true });

    // cy.checkalert("Non a valid email address.");
    // cy.checkalert("Non a valid email address.");

    cy.get('input[placeholder="CC email addresses (comma-delimited list)"]')
      .clear()
      .type("sample1@nomail.org,sample2@nomail.org");
    cy.get('input[placeholder="BCC email addresses (comma-delimited list)"]')
      .clear()
      .type("sample3@nomail.org,sample4@nomail.org");

    cy.get("div.card-body")
      .find("button:contains('Send mail')")
      .click({ force: true });

    cy.checkalert("Mail successfully sent");

    cy.get("div.card-body").contains(
      "Your email with subject: Your subject has been successfully sent!"
    );
    cy.get("div.card-body").contains("Destination address: sample@nomail.org");
    cy.get("div.card-body").contains(
      "CC: sample1@nomail.org,sample2@nomail.org"
    );
    cy.get("div.card-body").contains(
      "BCC: sample3@nomail.org,sample4@nomail.org"
    );
  });
});

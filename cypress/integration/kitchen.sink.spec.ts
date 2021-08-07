// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("KitchenSink", () => {
  it("TestSink", () => {
    cy.login();

    cy.visit("/app/sink");

    cy.closecookielaw();

    cy.location("pathname").then((pathname) => {
      if (pathname === "/app/sink") {
        // Kitchen Sink is enabled, add here all tests!

        cy.get("div.card-header h4").contains("Kitchen Sink");

        // Normal formly forms
        cy.get("ul.nav-tabs li.nav-item a.active").contains("ngx-formly");

        cy.get("formly-wrapper-form-field");
        cy.get('button:contains("Submit")').click({ force: true });
        // This is email
        cy.checkvalidation(0, "This field is required");
        // This is password
        cy.checkvalidation(1, "This field is required");
        // This is url
        cy.checkvalidation(2, "This field is required");

        cy.get('input[placeholder="email"]').as("email");
        cy.get('input[placeholder="password"]').as("pwd");
        cy.get('input[placeholder="url"]').as("url");
        cy.get('input[placeholder="date"]').as("date");

        cy.get("@email").clear().type("Invalid");
        cy.checkvalidation(0, "Invalid email address");

        cy.get("@email").clear().type("user@sample.org");
        cy.get("@pwd").clear().type("thisIsVeryS3cret!");

        cy.get("@url").clear().type("invalid");
        cy.checkvalidation(0, "Invalid web address");

        cy.get("@url").clear().type("www.google.");
        cy.checkvalidation(0, "Invalid web address");

        cy.get("@url").clear().type("www.google.c");
        cy.checkvalidation(0, "Invalid web address");

        cy.get("@url").clear().type("www.google.co");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address"
        );

        cy.get("@url").clear().type("wwwgoogle.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address"
        );

        // Not allowed in cypress...
        // cy.get('input[ngbdatepicker]').should('be.readonly')

        cy.get("@url").clear().type("http://www.google.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address"
        );

        cy.get("@url").clear().type("https://www.google.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address"
        );

        cy.get("@url").clear().type("httpx://www.google.com");
        cy.checkvalidation(0, "Invalid web address");

        cy.get("@url").clear().type("ftp://www.google.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address"
        );

        cy.get("@url").clear().type("user@sample.org");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address"
        );

        cy.get("@url").clear().type("www.google.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address"
        );

        // to verify that the placeholder works
        cy.get("@date").click();
        // first click opens, second click closes
        cy.get("@date").click();
        // to verify that the type is ngbdatepicker
        cy.get("input[ngbdatepicker]").click();

        cy.get(
          'ngb-datepicker-navigation-select select[title="Select month"]'
        ).select("5");
        cy.get(
          'ngb-datepicker-navigation-select select[title="Select year"]'
        ).select("1981");
        cy.get("div.ngb-dp-day div").contains("19").click({ force: true });

        cy.contains("Option1");
        cy.contains("Option2");
        cy.contains("Option3");
        cy.contains("Description 3");
        cy.contains("Option4");
        cy.contains("Description 4");

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"email": "user@sample.org"');
        cy.contains('"password": "thisIsVeryS3cret!"');
        cy.contains('"date": "1981-05-19T00:00:00.000Z"');

        cy.get("button.btn-outline-danger").find("i.fa-times").parent().click();
        cy.get('button:contains("Submit")').click({ force: true });
        cy.contains('"date": null');

        // Horizontal formly forms
        cy.get("ul.nav-tabs li.nav-item a")
          .contains("horizontal forms")
          .click();

        cy.get("formly-horizontal-wrapper");

        cy.get("@email").clear();
        cy.get("@pwd").clear();

        cy.get('button:contains("Submit")').click({ force: true });
        cy.checkvalidation(0, "This field is required");
        cy.checkvalidation(1, "This field is required");

        cy.get("@email").clear().type("Invalid");
        cy.checkvalidation(0, "Invalid email address");

        cy.get("@email").clear().type("user2@sample.org");
        cy.get("@pwd").clear().type("thisIsSUPERS3cret!");

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"email": "user2@sample.org"');
        cy.contains('"password": "thisIsSUPERS3cret!"');

        // Upload
        cy.get("ul.nav-tabs li.nav-item a").contains("ngx-uploadx").click();

        // Datatables
        cy.get("ul.nav-tabs li.nav-item a").contains("ngx-datatable").click();

        // What more??
      }
    });
  });
});

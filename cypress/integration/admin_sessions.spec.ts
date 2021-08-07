// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminSessions", () => {
  beforeEach(() => {
    // Two login... to have some tokens to test with
    cy.login();
    cy.login();

    cy.visit("/app/admin/sessions");

    cy.closecookielaw();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/sessions");
    });
  });

  // This is the same as in profile.sessions.spec
  it("Sortm search, copy", () => {
    // Sort by Expiration, current token is now the last
    cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    cy.get("datatable-body-row").first().find(".fa-trash");
    // Sort by Expiration, current token is now the first
    cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    cy.get("datatable-body-row").first().find(".fa-trash").should("not.exist");

    cy.get("datatable-body-row").its("length").should("be.gte", 1);
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type("thisisinvalidforsure");
    cy.get("datatable-body-row").should("have.length", 0);

    // Filter by username
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("datatable-body-row").its("length").should("be.gte", 1);

    // Filter by location (only Unknown sessions should be included here)
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type("Unknown");
    cy.get("datatable-body-row").its("length").should("be.gte", 1);

    // Filter by IP
    cy.get("datatable-body-row")
      .first()
      .find("datatable-body-cell")
      .eq(1)
      .then(($cell) => {
        const IP = $cell.text();
        cy.get('input[placeholder="Type to filter sessions"]').clear().type(IP);
        cy.get("datatable-body-row").its("length").should("be.gte", 1);
      });

    // This is the same as in profile.sessions.spec
    cy.get("datatable-body-row").first().find(".fa-clipboard").click();
    // cy.checkalert("Token successfully copied");

    // Verify the clipboard requires an additional plugin...
  });

  // This is the same as in profile.sessions.spec
  it("Delete", () => {
    cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    cy.get("datatable-body-row").first().find(".fa-trash").click();
    cy.get("h3.popover-title").contains("Confirmation required");
    cy.get("button").contains("Cancel").click();
    cy.get("datatable-body-row").first().find(".fa-trash").click();
    cy.get("h3.popover-title").contains("Confirmation required");
    cy.get("button").contains("Confirm").click();

    cy.checkalert("Confirmation: token successfully deleted");
  });
});

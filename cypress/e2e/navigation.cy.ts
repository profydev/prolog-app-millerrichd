describe("Sidebar Navigation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/dashboard");
  });

  context("desktop resolution", () => {
    beforeEach(() => {
      cy.viewport(1025, 900);
    });

    it("links are working", () => {
      // check that each link leads to the correct page
      cy.get("nav")
        .contains("Projects")
        .should("have.attr", "href", "/dashboard");

      cy.get("nav")
        .contains("Issues")
        .should("have.attr", "href", "/dashboard/issues");

      cy.get("nav")
        .contains("Alerts")
        .should("have.attr", "href", "/dashboard/alerts");

      cy.get("nav")
        .contains("Users")
        .should("have.attr", "href", "/dashboard/users");

      cy.get("nav")
        .contains("Settings")
        .should("have.attr", "href", "/dashboard/settings");
    });

    it("is collapsible", () => {
      // collapse navigation
      cy.get("nav").contains("Collapse").click();

      // check that links still exist and are functionable
      cy.get("nav").find("a").should("have.length", 5).eq(1).click();
      cy.url().should("eq", "http://localhost:3000/dashboard/issues");

      // check that text is not rendered
      cy.get("nav").contains("Issues").should("not.exist");
    });

    it("should flip the arrow on collapse when collapsed", () => {
      cy.get("img.menu-item-link_icon__WDzQ3 ").should("be.visible");

      cy.get("nav").contains("Collapse").click();

      cy.get(
        "img.menu-item-link_icon__WDzQ3.menu-item-link_flipIcon__rRrzo",
      ).should("be.visible");
    });

    it("support button should open user default email", () => {
      // Spy on the 'window.open' method
      cy.window().then((win) => {
        cy.spy(win, "open").as("open");
      });

      // Click the button that triggers the 'window.open' with a mailto link
      cy.get("nav").contains("Support").click();

      // Wait for a brief moment to allow for the window.open to take effect
      cy.wait(500);

      // Check if the 'window.open' was called with the expected mailto link
      cy.get("@open").should(
        "be.calledWithMatch",
        /^mailto:support@prolog-app.com\?subject=Support%20Request%3A%20/,
      );
    });
  });

  context("mobile resolution for testing icon on ipad", () => {
    it("should use the large icon on the header when in portrait mode and not collapsed", () => {
      cy.viewport("ipad-2", "portrait");
      cy.get("img.sidebar-navigation_logo__LwoQa").should("be.visible");
      cy.get("img.sidebar-navigation_logo__LwoQa").should(
        "have.attr",
        "src",
        "/icons/logo-large.svg",
      );
    });
    it("should use the large icon on the header when in landscape mode and not collapsed", () => {
      cy.viewport("ipad-2", "landscape");
      cy.get("img.sidebar-navigation_logo__LwoQa").should("be.visible");
      cy.get("img.sidebar-navigation_logo__LwoQa").should(
        "have.attr",
        "src",
        "/icons/logo-large.svg",
      );
    });
    it("should use the large icon on the header when in landscape mode and not collapsed", () => {
      cy.viewport("ipad-2", "landscape");
      cy.get("nav").contains("Collapse").click();
      cy.get("img.sidebar-navigation_logo__LwoQa").should(
        "have.attr",
        "src",
        "/icons/logo-small.svg",
      );
      cy.viewport("ipad-2", "portrait");
      cy.get("img.sidebar-navigation_logo__LwoQa").should("be.visible");
      cy.get("img.sidebar-navigation_logo__LwoQa").should(
        "have.attr",
        "src",
        "/icons/logo-large.svg",
      );
    });
  });

  context("mobile resolution", () => {
    beforeEach(() => {
      cy.viewport("iphone-8");
    });

    function isInViewport(el: string) {
      cy.get(el).then(($el) => {
        // navigation should cover the whole screen
        const rect = $el[0].getBoundingClientRect();
        expect(rect.right).to.be.equal(rect.width);
        expect(rect.left).to.be.equal(0);
      });
    }

    function isNotInViewport(el: string) {
      cy.get(el).then(($el) => {
        // naviation should be outside of the screen
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.equal(-rect.width);
        expect(rect.right).to.be.equal(0);
      });
    }

    it("toggles sidebar navigation by clicking the menu icon", () => {
      // wait for animation to finish
      cy.wait(500);
      isNotInViewport("nav");

      // open mobile navigation
      cy.get("img[alt='open menu']").click();

      // wait for animation to finish
      cy.wait(500);
      isInViewport("nav");

      // check that all links are rendered
      cy.get("nav").find("a").should("have.length", 5);

      // Support button should be rendered but Collapse button not
      cy.get("nav").contains("Support").should("exist");
      cy.get("nav").contains("Collapse").should("not.be.visible");

      // close mobile navigation and check that it disappears
      cy.get("img[alt='close menu']").click();
      cy.wait(500);
      isNotInViewport("nav");
    });
  });
});

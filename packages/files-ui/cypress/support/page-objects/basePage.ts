// Only add things here that could be applicable to all / most pages

export const basePage = {
  appHeaderLabel: () => cy.get("[data-cy=label-files-app-header]", { timeout: 20000 }),
  searchInput: () => cy.get("[data-testid=input-search-bar]"),
  signOutDropdown: () => cy.get("[data-testid=dropdown-title-sign-out-dropdown]"),
  signOutMenuOption: () => cy.get("[data-cy=menu-sign-out]"),
  notificationButton: () => cy.get("[data-testid=dropdown-title-notifications]"),
  notificationsHeader: () => cy.get("[data-cy=label-notifications-header]"),
  notificationsThisWeekHeader: () => cy.get("[data-cy=label-notifications-this-week]"),
  notificationsOlderHeader: () => cy.get("[data-cy=label-notifications-older]"),
  notificationContainer: () => cy.get("[data-cy=container-notification]"),
  notificationTitle: () => cy.get("[data-cy=label-notification-title]"),
  notificationTime: () => cy.get("[data-cy=label-notification-time]"),

  // Mobile view only element
  hamburgerMenuButton: () => cy.get("[data-testid=icon-hamburger-menu]"),

  // helpers and convenience functions
  awaitBucketRefresh() {
    cy.intercept("POST", "**/bucket/*/ls").as("refresh")
    cy.wait("@refresh")
  }
}

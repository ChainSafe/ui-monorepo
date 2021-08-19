/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

 export default (on: any) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on("before:browser:launch", (browser: Cypress.Browser, launchOptions: Cypress.BrowserLaunchOptions) => {
    if (browser.name === "chrome" && browser.isHeadless) {
      // fullPage screenshot size is 1280x720 on non-retina screens
      launchOptions.args.push("--window-size=1280,720")

      // force screen to be non-retina (1280x720 size)
      launchOptions.args.push("--force-device-scale-factor=1")
    }

    if (browser.name === "electron" && browser.isHeadless) {
      // fullPage screenshot size is 12807200
      launchOptions.preferences.width = 1280
      launchOptions.preferences.height = 720
    }

    if (browser.name === "firefox" && browser.isHeadless) {
      // menubars take up height on the screen
      launchOptions.args.push("--width=1280")
      launchOptions.args.push("--height=720")
    }

    return launchOptions
  })
}

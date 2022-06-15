import { defineConfig } from "cypress"

export default defineConfig({
  video: false,
  retries: {
    runMode: 2,
    openMode: 0
  },
  chromeWebSecurity: false,
  e2e: {
    experimentalSessionAndOrigin: true,
    specPattern: "cypress/tests/**/*.cy.{js,jsx,ts,tsx}",

    setupNodeEvents(on: any) {
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
  }
})

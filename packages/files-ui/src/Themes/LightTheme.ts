import { createTheme } from "@chainsafe/common-theme"

export const lightTheme = createTheme({
  themeConfig: {
    palette: {
      primary: {
        main: "#262626",
        hover: "#FFF"
      },
      secondary: {
        main: "#FFF",
        hover: "#000"
      }
    },
    constants: {
      mobileButtonHeight: 44,
      headerHeight: 60,
      navWidth: 8 * 27, // constants.generalUnit
      contentPadding: 8 * 15, // constants.generalUnit
      contentTopPadding: 8 * 15, // constants.generalUnit
      mobileHeaderHeight: 8 * 6.3, // constants.generalUnit
      svgWidth: 8 * 2.5, // constants.generalUnit
      topPadding: 8 * 3, // constants.generalUnit
      mobileNavWidth: 8 * 30, // constants.generalUnit
      headerTopPadding: 8 * 3, // constants.generalUnit
      accountControlsPadding: 8 * 7 // constants.generalUnit
    },
    overrides: {
      Typography: {
        h5: {
          fontWeight: 600,
          color: "#000000"
        }
      },
      Button: {
        variants: {
          primary: {
            active: {
              color: "#262626",
              "& svg": {
                fill: "#262626"
              }
            },
            hover: {
              color: "#262626",
              "& svg": {
                fill: "#262626"
              }
            },
            focus: {
              color: "#262626",
              "& svg": {
                fill: "#262626"
              }
            }
          }
        }
      }
    }
  }
})

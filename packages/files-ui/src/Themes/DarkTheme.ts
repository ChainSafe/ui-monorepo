import { createTheme } from "@chainsafe/common-theme"
import { UI_CONSTANTS } from "./Constants"

export const darkTheme = createTheme({
  globalStyling: {
    body: {
      backgroundColor: "#525252",
      color: "#DBDBDB",
    },
  },
  themeConfig: {
    palette: {
      primary: {
        main: "#262626",
        hover: "#FFF",
      },
      secondary: {
        main: "#FFF",
        hover: "#000",
      },
    },
    constants: {
      ...UI_CONSTANTS,
    },
    overrides: {
      Typography: {
        h5: {
          fontWeight: 600,
          color: "#DBDBDB",
        },
      },
      Button: {
        variants: {
          primary: {
            active: {
              color: "#262626",
              "& svg": {
                fill: "#262626",
              },
            },
            hover: {
              color: "#262626",
              "& svg": {
                fill: "#262626",
              },
            },
            focus: {
              color: "#262626",
              "& svg": {
                fill: "#262626",
              },
            },
          },
        },
      },
    },
  },
})

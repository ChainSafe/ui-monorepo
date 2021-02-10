import { createTheme } from "@chainsafe/common-theme"
import { UI_CONSTANTS } from "./Constants"

export const lightTheme = createTheme({
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
          color: "#000000",
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

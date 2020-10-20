import { createTheme } from "@imploy/common-themes"

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
      mobileButtonHeight: 44,
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

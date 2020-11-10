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
    constants: {},
    overrides: {
      Typography: {},
      Button: {},
    },
  },
})

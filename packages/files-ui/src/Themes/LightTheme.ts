import { createTheme } from "@imploy/common-components"

export const lightTheme = createTheme({
  themeConfig: {
    palette: {
      primary: {
        main: "#000",
        hover: "#FFF",
      },
      secondary: {
        main: "#FFF",
        hover: "#000",
      },
    },
    overrides: {
      Avatar: {
        root: {
          backgroundColor: "red",
        },
      },
    },
  },
})

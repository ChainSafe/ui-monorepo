import { createTheme } from "@imploy/common-themes"

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

import { DefaultThemeConfig } from "./ThemeConfig"
export const DefaultGlobalStyling = {
  html: {
    ...DefaultThemeConfig.typography.global,
    WebkitFontSmoothing: "antialiased", // Antialiasing.
    MozOsxFontSmoothing: "grayscale", // Antialiasing.
    // Change from `box-sizing: content-box` so that `width`
    // is not affected by `padding` or `border`.
    boxSizing: "border-box",
  },
  body: {
    color: DefaultThemeConfig.palette.text.primary,
    ...DefaultThemeConfig.typography.body2,
    backgroundColor: DefaultThemeConfig.palette.background.default,
    "@media print": {
      // Save printer ink.
      backgroundColor: DefaultThemeConfig.palette.common?.white.main,
    },
  },
  a: {
    outline: "none",
    textDecoration: "underline",
    color: DefaultThemeConfig.palette.common?.black.main,
  },
}

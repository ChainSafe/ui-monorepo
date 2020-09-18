import { createTheme, ThemeProvider } from "@chainsafe/common-themes"

const lightTheme = createTheme()
const darkTheme = createTheme()

export const contexts = [
  {
    icon: "box", // a icon displayed in the Storybook toolbar to control contextual props
    title: "Themes", // an unique name of a contextual environment
    components: [ThemeProvider],
    params: [
      // an array of params contains a set of predefined `props` for `components`
      { name: "Light Theme", props: { theme: lightTheme } },
      { name: "Dark Theme", props: { theme: darkTheme } },
    ],
    options: {
      deep: true,
      disable: false,
      cancelable: true,
    },
  },
  /* ... */ // multiple contexts setups are supported
]

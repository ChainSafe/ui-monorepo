import { createTheme, ThemeSwitcher } from "@chainsafe/common-theme"
import { ThemeProvider } from "@material-ui/styles"

const lightTheme = createTheme()
const darkTheme = createTheme()

export const contexts = [
  {
    icon: "box", // a icon displayed in the Storybook toolbar to control contextual props
    title: "Themes", // an unique name of a contextual environment
    components: [ThemeSwitcher],
    params: [
      // an array of params contains a set of predefined `props` for `components`
      { name: "Light Theme", 
        props: { 
          themes: [lightTheme, darkTheme]
        } 
      },
    ],
    options: {
      deep: true,
      disable: false,
      cancelable: true,
    },
  },
  /* ... */ // multiple contexts setups are supported
]

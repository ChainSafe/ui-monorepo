import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  html {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.palette.brand.background};
    font-family: ${({ theme }) => theme.typography.body};
  }
`

export { GlobalStyles }

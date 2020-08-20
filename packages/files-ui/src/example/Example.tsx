import React from "react"
import { AddCircleIcon } from "@chainsafe/common-components"
import { ThemeProvider, createTheme } from "@chainsafe/common-themes"
// import { ThemeProvider } from "@material-ui/styles"

function Example() {
  return (
    <ThemeProvider theme={createTheme()}>
      <div>
        <AddCircleIcon color="" />
        <ExampleChild />
      </div>
    </ThemeProvider>
  )
}

function ExampleChild() {
  return <div>child</div>
}

export { Example }

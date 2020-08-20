import React from "react"
import { AddCircleIcon } from "@chainsafe/common-components"
import { createTheme } from "@chainsafe/common-themes"
import { ThemeProvider } from "@material-ui/styles"

function Example() {
  return (
    <ThemeProvider theme={createTheme()}>
      <div>
        <AddCircleIcon />
        <ExampleChild />
      </div>
    </ThemeProvider>
  )
}

function ExampleChild() {
  return <div>child</div>
}

export { Example }

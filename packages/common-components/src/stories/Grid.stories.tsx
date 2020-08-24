import React, { ReactNode } from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { Grid } from "../Grid"
import {
  flexDirectionOptions,
  alignItemsOptions,
  justifyContentOptions,
  flexWrapOptions,
  gridSizeOptions,
  // gridSizeOptions
} from "../Grid/Styles"

function Box({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: "100%", border: "1px solid grey", padding: "8px" }}>
      {children}
    </div>
  )
}

export default {
  title: "Grid",
  component: Grid,
  decorators: [withKnobs],
}

export const FlexOptions = (): React.ReactNode => (
  <Grid
    item
    flexDirection={select("Flex direction", flexDirectionOptions, "row")}
    alignItems={select("Align Items", alignItemsOptions, "flex-start")}
    justifyContent={select(
      "Justify content",
      justifyContentOptions,
      "flex-start",
    )}
    flexWrap={select("Flex wrap", flexWrapOptions, "wrap")}
  >
    <Box>Box 1</Box>
    <Box>Box 2</Box>
    <Box>Box 3</Box>
  </Grid>
)

export const GridDisplay = (): React.ReactNode => (
  <Grid container>
    <Grid
      item
      xs={select("box 1", gridSizeOptions, 12)}
      sm={select("box 1", gridSizeOptions, 12)}
      md={select("box 1", gridSizeOptions, 12)}
      lg={select("box 1", gridSizeOptions, 12)}
    >
      <Box>Box 1</Box>
    </Grid>
    <Grid
      item
      xs={select("box 2", gridSizeOptions, 12)}
      sm={select("box 2", gridSizeOptions, 12)}
      md={select("box 2", gridSizeOptions, 12)}
      lg={select("box 2", gridSizeOptions, 12)}
    >
      <Box>Box 2</Box>
    </Grid>
  </Grid>
)

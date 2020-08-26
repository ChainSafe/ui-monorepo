import React, { ReactNode } from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { Grid } from "../Grid"
import {
  flexDirectionOptions,
  alignItemsOptions,
  justifyContentOptions,
  flexWrapOptions,
  gridSizeOptions,
  spacingOptions,
} from "../Grid/Styles"

function Box({ children }: { children: ReactNode }) {
  return (
    <div style={{ flex: 1, border: "1px solid grey", padding: "8px" }}>
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
  <Grid container fullWidth>
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

export const GridSpacing = (): React.ReactNode => (
  <Grid container spacing={select("Spacing", spacingOptions, 1)}>
    <Grid item xs={12} sm={6} md={3} lg={3}>
      <Box>Box 1</Box>
    </Grid>
    <Grid item xs={12} sm={6} md={3} lg={3}>
      <Box>Box 2</Box>
    </Grid>
  </Grid>
)

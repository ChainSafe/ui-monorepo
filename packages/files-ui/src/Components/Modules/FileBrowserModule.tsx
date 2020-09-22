import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React from "react"
import { Button, Divider, Typography } from "@chainsafe/common-components"

/**
 * TODO: Establish height & padding values
 * TODO: position fix + position nav wrappers
 * Content will have padding based on wrappers to ensure system scroll
 */

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {},
  }),
)

const FileBrowserModule: React.FC = () => {
  const classes = useStyles()
  return (
    <article className={classes.root}>
      <header>
        <Typography variant="h1" component="h1"> 
          My Files
        </Typography>
        <Button variant="outline">
          New folder
        </Button>
        <Button variant="outline">
          Upload
        </Button>
      </header>
      <Divider />
    </article>
  )
}

export default FileBrowserModule

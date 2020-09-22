import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React from "react"
import { Button, Divider, PlusCircleIcon, Typography, UploadIcon } from "@chainsafe/common-components"

/**
 * TODO: Establish height & padding values
 * TODO: position fix + position nav wrappers
 * Content will have padding based on wrappers to ensure system scroll
 */

const useStyles = makeStyles(({
  constants
}: ITheme) =>
  createStyles({
    root: {},
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    controls:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > *": {
        marginLeft: constants.generalUnit
      }
    },
    divider: {
      margin: `${constants.generalUnit * 4.5}px 0`
    },

  }),
)

const FileBrowserModule: React.FC = () => {
  const classes = useStyles()
  return (
    <article className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h1" component="h1"> 
          My Files
        </Typography>
        <div className={classes.controls}>
          <Button variant="outline">
            <PlusCircleIcon />
            New folder
          </Button>
          <Button variant="outline">
            <UploadIcon />
            Upload
          </Button>
        </div>
      </header>
      <Divider className={classes.divider} />
    </article>
  )
}

export default FileBrowserModule

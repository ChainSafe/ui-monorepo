import React from "react"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import { useFiles } from "../../../Contexts/FilesContext"
import DownloadBox from "./DownloadBox"

const useStyles = makeStyles(({ constants, zIndex, breakpoints }: ITheme) => {
  const WIDTH = 400
  return createStyles({
    root: {
      margin: constants.generalUnit * 3,
      position: "fixed",
      right: 0,
      bottom: 0,
      borderRadius: 4,
      padding: constants.generalUnit,
      width: WIDTH,
      zIndex: zIndex?.layer1,
      [breakpoints.down("md")]: {
        margin: constants.generalUnit,
        width: `calc(100% - ${constants.generalUnit * 2}px)`
      }
    }
  })
})

const DownloadProgressModals: React.FC = () => {
  const classes = useStyles()
  const { downloadsInProgress } = useFiles()

  if (downloadsInProgress.length > 0) {
    return (
      <div className={classes.root}>
        {downloadsInProgress.map((downloadInProgress) => (
          <DownloadBox
            key={downloadInProgress.id}
            downloadInProgress={downloadInProgress}
          />
        ))}
      </div>
    )} else {
    return null
  }
}

export default DownloadProgressModals

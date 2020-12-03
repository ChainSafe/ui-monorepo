import React from "react"
import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@chainsafe/common-theme"
import { useDrive } from "../../../Contexts/DriveContext"
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
        width: `calc(100% - ${constants.generalUnit * 2}px)`,
      },
    },
  })
})

const DownloadProgressModals: React.FC = () => {
  const classes = useStyles()
  const { downloadsInProgress } = useDrive()
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  return (
    <div className={classes.root}>
      {downloadsInProgress.map(
        (downloadInProgress) =>
          (desktop ||
            downloadInProgress.complete ||
            downloadInProgress.error) && (
            <DownloadBox
              key={downloadInProgress.id}
              downloadInProgress={downloadInProgress}
            />
          ),
      )}
    </div>
  )
}

export default DownloadProgressModals

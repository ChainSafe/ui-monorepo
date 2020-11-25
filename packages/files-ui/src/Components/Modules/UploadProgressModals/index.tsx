import React from "react"
import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@chainsafe/common-theme"
import { useDrive } from "../../../Contexts/DriveContext"
import UploadBox from "./UploadBox"

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

const UploadProgressModals: React.FC = () => {
  const classes = useStyles()
  const { uploadsInProgress } = useDrive()
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  return (
    <div className={classes.root}>
      {uploadsInProgress.map(
        (uploadInProgress) =>
          (desktop || uploadInProgress.complete || uploadInProgress.error) && (
            <UploadBox
              key={uploadInProgress.id}
              uploadInProgress={uploadInProgress}
            />
          ),
      )}
    </div>
  )
}

export default UploadProgressModals

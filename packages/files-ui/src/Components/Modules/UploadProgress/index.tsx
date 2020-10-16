import React from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { useDrive } from "../../../Contexts/DriveContext"
import UploadBox from "./UploadBox"

const useStyles = makeStyles(({ constants, zIndex, breakpoints }: ITheme) => {
  const WIDTH = 400
  return createStyles({
    root: {
      margin: constants.generalUnit * 3,
      position: "absolute",
      right: 0,
      bottom: 0,
      borderRadius: 4,
      padding: constants.generalUnit,
      width: WIDTH,
      zIndex: zIndex?.layer1,
      [breakpoints.down("sm")]: {
        margin: constants.generalUnit * 2,
        width: `calc(100% - ${constants.generalUnit * 4}px)`,
      },
    },
  })
})

const UploadProgressView: React.FC = () => {
  const classes = useStyles()
  const { uploadsInProgress } = useDrive()

  return (
    <>
      <div className={classes.root}>
        {uploadsInProgress.map((uploadInProgress) => (
          <UploadBox
            key={uploadInProgress.id}
            uploadInProgress={uploadInProgress}
          />
        ))}
      </div>
    </>
  )
}

export default UploadProgressView

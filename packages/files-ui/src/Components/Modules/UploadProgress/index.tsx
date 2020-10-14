import React, { useState } from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { ProgressBar, Typography } from "@imploy/common-components"

const uploadsInProgressData = [
  {
    fileName: "file1.jpg",
    progress: 20,
    error: undefined,
    complete: false,
    noOfFiles: 1,
  },
  {
    fileName: "file1.jpg",
    progress: 50,
    error: undefined,
    complete: false,
    noOfFiles: 2,
  },
  {
    fileName: "file1.jpg",
    progress: 100,
    error: undefined,
    complete: true,
    noOfFiles: 1,
  },
  {
    fileName: "file1.jpg",
    progress: 100,
    error: undefined,
    complete: true,
    noOfFiles: 1,
  },
  {
    fileName: "file1.jpg",
    progress: 20,
    error: true,
    complete: false,
    noOfFiles: 1,
  },
]

const useStyles = makeStyles(
  ({ constants, palette, zIndex, breakpoints }: ITheme) => {
    const WIDTH = 400
    return createStyles({
      wrapper: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      },
      root: {
        margin: constants.generalUnit * 3,
        position: "absolute",
        right: 0,
        bottom: 0,
        borderRadius: 4,
        border: `1px solid ${palette.additional["gray"][6]}`,
        backgroundColor: palette.additional["gray"][3],
        padding: constants.generalUnit,
        width: WIDTH,
        zIndex: zIndex?.layer1,
        [breakpoints.down("sm")]: {
          margin: constants.generalUnit * 2,
          width: `calc(100% - ${constants.generalUnit * 4}px)`,
        },
      },
      boxContainer: {
        padding: constants.generalUnit,
      },
    })
  },
)

const UploadProgress: React.FC = () => {
  const classes = useStyles()
  const [uploadsInProgress, setUploadsInProgress] = useState(
    uploadsInProgressData,
  )

  return (
    <div className={classes.wrapper}>
      <div className={classes.root}>
        <div>
          <button></button>
        </div>
        {uploadsInProgress.map((uploadInProgress) => (
          <div className={classes.boxContainer}>
            {uploadInProgress.complete ? (
              <div>{uploadInProgress.fileName}</div>
            ) : uploadInProgress.error ? (
              <div>error</div>
            ) : (
              <div>
                <ProgressBar
                  progress={uploadInProgress.progress}
                  size="small"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadProgress

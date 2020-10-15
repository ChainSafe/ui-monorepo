import React, { useState } from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { ProgressBar } from "@imploy/common-components"
import UploadBox from "./UploadBox"

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
        padding: constants.generalUnit,
        width: WIDTH,
        zIndex: zIndex?.layer1,
        [breakpoints.down("sm")]: {
          margin: constants.generalUnit * 2,
          width: `calc(100% - ${constants.generalUnit * 4}px)`,
        },
      },
      boxContainer: {
        backgroundColor: palette.additional["gray"][3],
        margin: `${constants.generalUnit}px 0`,
        border: `1px solid ${palette.additional["gray"][6]}`,
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

  const remove = (index: number) => {
    uploadsInProgress.splice(index, 1)
    setUploadsInProgress([...uploadsInProgress])
  }

  const add = () => {
    setUploadsInProgress([
      ...uploadsInProgress,
      {
        complete: false,
        error: false,
        fileName: "file",
        noOfFiles: 1,
        progress: 20,
      },
    ])
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.root}>
        {uploadsInProgress.map((uploadInProgress, index) => (
          <UploadBox
            fileName={uploadInProgress.fileName}
            progress={uploadInProgress.progress}
            error={uploadInProgress.error}
            complete={uploadInProgress.complete}
            noOfFiles={uploadInProgress.noOfFiles}
            index={index}
            remove={() => remove(index)}
          />
        ))}
        <button onClick={add}>click</button>
      </div>
    </div>
  )
}

export default UploadProgress

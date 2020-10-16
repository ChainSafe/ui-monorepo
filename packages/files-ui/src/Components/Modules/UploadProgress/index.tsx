import React from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { useDrive } from "@imploy/common-contexts"
import UploadBox from "./UploadBox"

const useStyles = makeStyles(({ constants, zIndex, breakpoints }: ITheme) => {
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
  })
})

const UploadProgressView: React.FC = () => {
  const classes = useStyles()
  const { uploadsInProgress } = useDrive()
  const [rUploads, setRUploads] = React.useState(uploadsInProgress)

  const add = () => {
    setRUploads([
      ...rUploads,
      {
        id: "1",
        complete: false,
        error: false,
        progress: 20,
        fileName: "file",
        noOfFiles: 1,
      },
    ])
  }

  return (
    <>
      <div>
        <button onClick={add}>add</button>
      </div>
      {/* <div className={classes.wrapper}> */}
      <div className={classes.root}>
        {rUploads.map((uploadInProgress, index) => (
          <UploadBox
            key={uploadInProgress.id}
            uploadInProgress={uploadInProgress}
          />
        ))}
      </div>
      {/* </div> */}
    </>
  )
}

export default UploadProgressView

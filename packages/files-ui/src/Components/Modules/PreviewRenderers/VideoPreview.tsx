import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, createStyles } from "@chainsafe/common-theme"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "100vw"
    }
  })
)

const VideoPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>()

  const classes = useStyles()
  useEffect(() => {
    setVideoUrl(URL.createObjectURL(contents))

    return () => {
      videoUrl && URL.revokeObjectURL(videoUrl)
    }
    // eslint-disable-next-line
  }, [contents])

  return (
    <video
      className={classes.root}
      src={videoUrl}
      controls
      autoPlay/>
  )
}

export default VideoPreview

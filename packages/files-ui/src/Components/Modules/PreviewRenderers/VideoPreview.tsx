import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
// import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"

// const useStyles = makeStyles(({ constants, palette, zIndex }: ITheme) =>
//   createStyles({
//     root: {
//       width: "100%",
//       height: "100%",
//     },
//   }),
// )

const VideoPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>()

  useEffect(() => {
    setVideoUrl(URL.createObjectURL(contents))

    return () => {
      videoUrl && URL.revokeObjectURL(videoUrl)
    }
    // eslint-disable-next-line
  }, [contents])

  return <video src={videoUrl} controls autoPlay></video>
}

export default VideoPreview

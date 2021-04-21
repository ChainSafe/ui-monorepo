import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
// import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"

const AudioPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const [audioUrl, setAudioUrl] = useState<string | undefined>()

  useEffect(() => {
    setAudioUrl(URL.createObjectURL(contents))

    return () => {
      audioUrl && URL.revokeObjectURL(audioUrl)
    }
    // eslint-disable-next-line
  }, [contents])

  return (
    <audio
      controls
      src={audioUrl}
      autoPlay
    />
  )
}

export default AudioPreview

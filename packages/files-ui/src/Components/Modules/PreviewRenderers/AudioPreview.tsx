import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import {} from "@chainsafe/common-components"

const useStyles = makeStyles(({ constants, palette, zIndex }: ITheme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
  }),
)

const AudioPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const [audioUrl, setAudioUrl] = useState<string | undefined>()

  useEffect(() => {
    setAudioUrl(URL.createObjectURL(contents))

    return () => {
      audioUrl && URL.revokeObjectURL(audioUrl)
    }
  }, [contents])

  return <audio controls src={audioUrl} autoPlay></audio>
}

export default AudioPreview

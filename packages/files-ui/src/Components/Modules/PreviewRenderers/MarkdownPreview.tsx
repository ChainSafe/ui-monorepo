import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import ReactMarkdown from "react-markdown"

const useStyles = makeStyles(({ palette, constants, typography }: CSFTheme) =>
  createStyles({
    root: {
      maxWidth: "100vw",
      width: "100%",
      height: `calc(100vh - 
        ${constants.previewModal.previewTopNavHeight}px - 
        ${constants.generalUnit * 4}px)`,
      marginTop: constants.previewModal.previewBottomNavHeight + constants.generalUnit * 2,
      marginBottom: constants.generalUnit * 2
    },
    filePreview: {
      height: "100%",
      backgroundColor: palette.additional["gray"][1],
      padding: constants.generalUnit * 2,
      overflowY: "auto",
      textAlign: "left",
      whiteSpace: "pre-wrap",
      ...typography.body1
    },
    pageButton: {
      width: 80
    }
  })
)

const TextPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const [contentText, setContentText] = useState("")

  const classes = useStyles()

  useEffect(() => {
    const getContentText = async () => {
      const text = await contents.text()
      setContentText(text)
    }

    getContentText()
  }, [contents])

  return (
    <div className={classes.root}>
      <div className={classes.filePreview}>
        <ReactMarkdown source={contentText} />
      </div>
    </div>
  )
}

export default TextPreview

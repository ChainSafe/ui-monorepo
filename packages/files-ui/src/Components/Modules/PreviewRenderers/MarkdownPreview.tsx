import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm"

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
      ...typography.body1,
      "& h1": {
        ...typography.h1
      },
      "& h2": {
        ...typography.h2
      },
      "& h3": {
        ...typography.h3
      },
      "& h4": {
        ...typography.h4
      },
      "& h5": {
        ...typography.h5
      },
      "& p": {
        marginBottom: constants.generalUnit,
        ...typography.body1
      },
      "& ul": {
        listStyle: "disc",
        paddingLeft: constants.generalUnit * 2
      },
      "& ol": {
        listStyle: "decimal",
        paddingLeft: constants.generalUnit * 2
      }
    },
    pageButton: {
      width: 80
    }
  })
)

const TextPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const [contentText, setContentText] = useState("")

  const classes = useStyles()

  console.log("md preview")

  useEffect(() => {
    contents.text()
      .then((text) => setContentText(text))
      .catch(console.error)
  }, [contents])

  return (
    <div className={classes.root}>
      <div className={classes.filePreview}>
        <ReactMarkdown plugins={[gfm]} source={contentText} />
      </div>
    </div>
  )
}

export default TextPreview

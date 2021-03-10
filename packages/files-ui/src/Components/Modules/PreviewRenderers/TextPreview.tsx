import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, ZoomInIcon, ZoomOutIcon } from "@chainsafe/common-components"

const useStyles = makeStyles(({ palette, constants, typography, zIndex }: CSFTheme) =>
  createStyles({
    root: {
      maxWidth: "100vw",
      width: "100%",
      height: `calc(100vh - 
        ${constants.previewModal.previewTopNavHeight}px - 
        ${constants.previewModal.previewBottomNavHeight}px - 
        ${constants.generalUnit * 4}px)`
    },
    filePreview: {
      height: "100%",
      backgroundColor: palette.additional["gray"][1],
      padding: constants.generalUnit * 2,
      overflow: "scroll",
      textAlign: "left",
      ...typography.body1
    },
    controlsContainer: {
      position: "absolute",
      zIndex: zIndex?.layer1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      bottom: 0,
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: palette.additional["gray"][9],
      color: palette.additional["gray"][3],
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: palette.additional["gray"][8]
    },
    pageButton: {
      width: 80
    }
  })
)

const TextPreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const [contentText, setContentText] = useState<string | undefined>()

  const classes = useStyles()
  useEffect(() => {
    const getContentText = async () => {
      const text = await contents.text()
      setContentText(text)
    }

    getContentText()
    // eslint-disable-next-line
  }, [contents])

  const onZoomIn = () => {
    // 
  } 

  const onZoomOut = () => {
    // 
  } 

  return (
    <div className={classes.root}>
      <div className={classes.filePreview}>
        {contentText}
      </div>
      <div className={classes.controlsContainer}>
        <Button onClick={onZoomOut} className={classes.pageButton}>
          <ZoomOutIcon fontSize="medium" />
        </Button>
        <Button onClick={onZoomIn} className={classes.pageButton}>
          <ZoomInIcon fontSize="medium" />
        </Button>
      </div>
    </div>
  )
}

export default TextPreview

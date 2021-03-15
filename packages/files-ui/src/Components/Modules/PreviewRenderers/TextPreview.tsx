import React, { useEffect, useState, useCallback } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, ZoomInIcon, ZoomOutIcon, ScrollbarWrapper } from "@chainsafe/common-components"

interface ITextPreviewStyles {
  fontSize: number
}

const DEFAULT_FONT_SIZE = 16
const HIGHEST_FONT_SIZE = 24
const LOWEST_FONT_SIZE = 10

const useStyles = makeStyles(({ palette, constants, typography, zIndex }: CSFTheme) =>
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
    filePreview: ({ fontSize }: ITextPreviewStyles) => ({
      height: "100%",
      maxHeight: "100%",
      backgroundColor: palette.additional["gray"][1],
      padding: constants.generalUnit * 2,
      textAlign: "left",
      whiteSpace: "pre-wrap",
      ...typography.body1,
      fontSize
    }),
    controlsContainer: {
      position: "absolute",
      zIndex: zIndex?.layer1,
      display: "flex",
      flexDirection: "row",
      top: 0,
      right: 0,
      height: constants.generalUnit * 8,
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
  const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE)

  const classes = useStyles({ fontSize })

  useEffect(() => {
    const getContentText = async () => {
      const text = await contents.text()
      setContentText(text)
    }

    getContentText()
  }, [contents])

  const onZoomIn = useCallback(() => {
    setFontSize(fontSize + 2)
  }, [fontSize]) 

  const onZoomOut = useCallback(() => {
    setFontSize(fontSize - 2)
  }, [fontSize]) 

  return (
    <div className={classes.root}>
      <ScrollbarWrapper className={classes.filePreview}>
        {contentText}
      </ScrollbarWrapper>
      <div className={classes.controlsContainer}>
        <Button disabled={fontSize <= LOWEST_FONT_SIZE} onClick={onZoomOut} className={classes.pageButton}>
          <ZoomOutIcon fontSize="medium" />
        </Button>
        <Button  disabled={fontSize >= HIGHEST_FONT_SIZE} onClick={onZoomIn} className={classes.pageButton}>
          <ZoomInIcon fontSize="medium" />
        </Button>
      </div>
    </div>
  )
}

export default TextPreview

import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, ZoomInIcon, ZoomOutIcon } from "@chainsafe/common-components"

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
        ${constants.generalUnit * 2}px)`
    },
    filePreview: ({ fontSize }: ITextPreviewStyles) => ({
      height: "100%",
      backgroundColor: palette.additional["gray"][1],
      padding: constants.generalUnit * 2,
      overflow: "scroll",
      textAlign: "left",
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

  const classes = useStyles({
    fontSize
  })
  useEffect(() => {
    const getContentText = async () => {
      const text = await contents.text()
      setContentText(text)
    }

    getContentText()
    // eslint-disable-next-line
  }, [contents])

  const onZoomIn = () => {
    setFontSize(fontSize + 2)
  } 

  const onZoomOut = () => {
    setFontSize(fontSize - 2)
  } 

  return (
    <div className={classes.root}>
      <div className={classes.filePreview}>
        {contentText}
      </div>
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

import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import {
  makeStyles,
  ITheme,
  createStyles,
  useMediaQuery,
  useTheme,
} from "@imploy/common-themes"
import {
  Button,
  ZoomInIcon,
  ZoomOutIcon,
  FullscreenIcon,
  // PrinterIcon,
} from "@imploy/common-components"

const useStyles = makeStyles(({ constants, palette, zIndex }: ITheme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
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
      borderColor: palette.additional["gray"][8],
    },
  }),
)

const ImagePreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>()

  useEffect(() => {
    setImageUrl(URL.createObjectURL(contents))

    return () => {
      imageUrl && URL.revokeObjectURL(imageUrl)
    }
  }, [contents])
  const classes = useStyles()
  const { breakpoints }: ITheme = useTheme()

  const desktop = useMediaQuery(breakpoints.up("sm"))

  return (
    <TransformWrapper
      options={{
        limitToBounds: true,
        limitToWrapper: true,
      }}
    >
      {
        //@ts-ignore
        ({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {desktop && (
              <div className={classes.controlsContainer}>
                <Button onClick={zoomIn}>
                  <ZoomInIcon />
                </Button>
                <Button onClick={zoomOut}>
                  <ZoomOutIcon />
                </Button>
                <Button onClick={resetTransform}>
                  <FullscreenIcon />
                </Button>
                {/* <Button>
                  <PrinterIcon />
                </Button> */}
              </div>
            )}
            <TransformComponent>
              <img src={imageUrl} alt="" className={classes.root} />
            </TransformComponent>
          </>
        )
      }
    </TransformWrapper>
  )
}

export default ImagePreview

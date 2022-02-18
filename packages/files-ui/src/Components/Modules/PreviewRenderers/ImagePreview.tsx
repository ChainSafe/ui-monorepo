import React, { useEffect, useState } from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import heicConvert from "heic-convert"

import {
  makeStyles,
  ITheme,
  createStyles,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import {
  Button,
  ZoomInIcon,
  ZoomOutIcon,
  FullscreenIcon,
  Loading
} from "@chainsafe/common-components"

const useStyles = makeStyles(
  ({ palette, zIndex, breakpoints }: ITheme) =>
    createStyles({
      root: {
        maxHeight: "100vh",
        maxWidth: "100vw",
        [breakpoints.up("md")]: {
          maxWidth: "80vw"
        }
      },
      controlsContainer: {
        position: "absolute",
        zIndex: zIndex?.layer1,
        display: "flex",
        flexDirection: "row",
        bottom: 34,
        left: "50%",
        transform: "translate(-50%)",
        height: 39,
        backgroundColor: palette.additional["gray"][8],
        color: palette.additional["gray"][3],
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: palette.additional["gray"][8],
        borderRadius: 2
      },
      imageControlButton: {
        borderRadius: 0
      }
    })
)

const ImagePreview: React.FC<IPreviewRendererProps> = ({ contents, contentType }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (contentType !== "image/heic" && contentType !== "image/heif") {
      setImageUrl(URL.createObjectURL(contents))
    } else {
      setLoading(true)
      contents.arrayBuffer()
        .then(b => heicConvert({
          buffer: Buffer.from(b),
          format: "JPEG",
          quality: 0.5
        }))
        .catch(console.error)
        .then(c => setImageUrl(URL.createObjectURL(new Blob([c]))))
        .finally(() => setLoading(false))
    }
  }, [contents, contentType])

  const classes = useStyles()
  const { desktop } = useThemeSwitcher()

  return (
    <div className={classes.root}>
      {loading
        ? <Loading
          size={50}
          type="initial"
        />
        : <TransformWrapper
          options={{
            limitToBounds: true,
            limitToWrapper: true,
            minScale: 0.2
          }}
        >
          {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
            ({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {desktop && (
                  <div className={classes.controlsContainer}>
                    <Button
                      onClick={zoomIn}
                      data-cy="button-zoom-in"
                      size="small"
                      className={classes.imageControlButton}
                    >
                      <ZoomInIcon />
                    </Button>
                    <Button
                      onClick={zoomOut}
                      data-cy="button-zoom-out"
                      size="small"
                      className={classes.imageControlButton}
                    >
                      <ZoomOutIcon />
                    </Button>
                    <Button
                      onClick={resetTransform}
                      data-cy="button-full-screen"
                      size="small"
                      className={classes.imageControlButton}
                    >
                      <FullscreenIcon />
                    </Button>
                  </div>
                )}
                <TransformComponent>
                  <img
                    src={imageUrl}
                    alt=""
                    className={classes.root}
                    onLoad={() => imageUrl && URL.revokeObjectURL(imageUrl)} />
                </TransformComponent>
              </>
            )
          }
        </TransformWrapper>
      }
    </div>
  )
}

export default ImagePreview

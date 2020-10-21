import React from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { makeStyles, ITheme, createStyles } from "@imploy/common-themes"
import classes from "*.module.css"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
  }),
)

const ImagePreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  const imageUrl = URL.createObjectURL(contents)
  const classes = useStyles()
  return (
    <TransformWrapper
      options={{
        limitToBounds: true,
        limitToWrapper: true,
      }}
    >
      {
        //@ts-ignore
        ({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <TransformComponent>
            <img src={imageUrl} alt="" className={classes.root} />
          </TransformComponent>
        )
      }
    </TransformWrapper>
  )
}

export default ImagePreview

import React from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { ProgressBar } from "@imploy/common-components"
import { UploadProgress } from "@imploy/common-contexts"

const useStyles = makeStyles(
  ({ constants, palette, animation, breakpoints }: ITheme) => {
    return createStyles({
      boxContainer: {
        backgroundColor: palette.additional["gray"][3],
        margin: `${constants.generalUnit}px 0`,
        border: `1px solid ${palette.additional["gray"][6]}`,
        padding: constants.generalUnit,
        animation: `$slideRight ${animation.translate}ms`,
        [breakpoints.down("sm")]: {
          animation: `$slideBottom ${animation.translate}ms`,
        },
      },
      "@keyframes slideRight": {
        from: { transform: "translate(100%)" },
        to: { transform: "translate(0)" },
      },
      "@keyframes slideBottom": {
        from: { transform: "translate(0, 100%)" },
        to: { transform: "translate(0, 0)" },
      },
    })
  },
)

interface IUploadBox {
  uploadInProgress: UploadProgress
}

const UploadBox: React.FC<IUploadBox> = (props) => {
  const { uploadInProgress } = props
  const { complete, error, fileName, noOfFiles, progress } = uploadInProgress
  const classes = useStyles()

  return (
    <div className={classes.boxContainer}>
      {complete ? (
        <div>
          {fileName} {noOfFiles}
        </div>
      ) : error ? (
        <div>error</div>
      ) : (
        <div>
          <ProgressBar progress={progress} size="small" />
        </div>
      )}
    </div>
  )
}

export default UploadBox

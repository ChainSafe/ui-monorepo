import React from "react"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import { UploadProgress } from "@imploy/common-contexts"
import {
  ProgressBar,
  Typography,
  CheckCircleIcon,
  CloseCircleIcon,
} from "@imploy/common-components"

const useStyles = makeStyles(
  ({ constants, palette, animation, breakpoints }: ITheme) => {
    return createStyles({
      boxContainer: {
        backgroundColor: palette.additional["gray"][3],
        margin: `${constants.generalUnit}px 0`,
        border: `1px solid ${palette.additional["gray"][6]}`,
        padding: constants.generalUnit * 2,
        borderRadius: 4,
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
      contentContainer: {
        display: "flex",
        alignItems: "center",
      },
      marginBottom: {
        marginBottom: constants.generalUnit,
      },
      marginRight: {
        marginRight: constants.generalUnit * 2,
      },
    })
  },
)

interface IUploadBox {
  uploadInProgress: UploadProgress
  removeUploadProgress(id: string): void
}

const UploadBox: React.FC<IUploadBox> = (props) => {
  const { uploadInProgress, removeUploadProgress } = props
  const { complete, error, noOfFiles, progress, id } = uploadInProgress
  const classes = useStyles()

  return (
    <div className={classes.boxContainer}>
      {complete ? (
        <div className={classes.contentContainer}>
          <CheckCircleIcon className={classes.marginRight} />
          <Typography variant="body1" component="p">
            Upload complete
          </Typography>
        </div>
      ) : error ? (
        <div className={classes.contentContainer}>
          <div onClick={() => removeUploadProgress(id)}>
            <CloseCircleIcon className={classes.marginRight} />
          </div>
          <Typography variant="body1" component="p">
            Something went wrong and we couldn't upload your file.
          </Typography>
        </div>
      ) : (
        <div>
          <Typography
            variant="body2"
            component="p"
            className={classes.marginBottom}
          >{`Uploading ${noOfFiles} ${
            noOfFiles === 1 ? "file" : "files"
          }...`}</Typography>
          <ProgressBar progress={progress} size="small" />
        </div>
      )}
    </div>
  )
}

export default UploadBox

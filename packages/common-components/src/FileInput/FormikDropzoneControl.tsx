/**
 *
 * FormikDropzoneControl
 *
 */

import React, { Fragment } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import Dropzone from "react-dropzone"
// import UploadedPdfIcon from "components/UploadedPdfIcon"
import { FieldProps, getIn } from "formik"
import { ITheme } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    dropzone: {
      "&> *": {
        width: "100%",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
      },
    },
  }),
)

interface OwnProps extends FieldProps {
  setFieldValue(fieldName: string, newFiles: any): void
}

const FormikDropzoneControl: React.SFC<OwnProps> = ({
  field,
  form,
}: OwnProps) => {
  if (!Array.isArray(field.value)) {
    console.log("Input field provided to Dropzone is not an array")
    return <Fragment />
  }
  const classes = useStyles()
  const { name: fieldName, value: fieldValue } = field
  const { touched, errors, setFieldValue, setFieldTouched, dirty } = form

  const fieldError = getIn(errors, fieldName)
  const showError = getIn(touched, fieldName) && !!fieldError

  return (
    <Fragment>
      <div className={classes.dropzone}>
        <Dropzone
          accept="application/pdf"
          disableClick={true}
          style={{
            display: "flex",
          }}
          onDrop={acceptedFiles => {
            if (acceptedFiles.length === 0) {
              return
            }
            setFieldValue(fieldName, fieldValue.concat(acceptedFiles))
            setFieldTouched(fieldName, true)
          }}
        >
          {({ isDragActive, isDragReject }) => {
            if (isDragActive) {
              return <p>"This file is authorized"</p>
            }
            if (isDragReject) {
              return <p>"This file is not authorized"</p>
            }
            if (fieldValue.length === 0) {
              return <p>Drag documents here</p>
            }
            return <p />
          }}
        </Dropzone>
      </div>
      {showError && <FormHelperText error>{fieldError}</FormHelperText>}
    </Fragment>
  )
}

export default withStyles(styles, { withTheme: true })(FormikDropzoneControl)

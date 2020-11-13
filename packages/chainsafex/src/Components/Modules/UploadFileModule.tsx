import {
  Button,
  FileInput,
  IButtonProps,
  UploadIcon,
} from "@imploy/common-components"
import { useFPS } from "../../Contexts/FPSContext"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import React from "react"
import { useState } from "react"
import { Formik, Form } from "formik"
import clsx from "clsx"
import { array, object } from "yup"
import CustomModal from "../Elements/CustomModal"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit * 4,
      "& footer": {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      },
    },
    input: {
      marginBottom: constants.generalUnit * 2,
    },
    cta: {},
    okButton: {
      marginLeft: constants.generalUnit,
      color: palette.common.white.main,
      backgroundColor: palette.common.black.main,
    },
    cancelButton: {},
    label: {
      fontSize: 14,
      lineHeight: "22px",
    },
  }),
)

interface IUploadFileModuleProps extends IButtonProps {
  classNames?: {
    button?: string
  }
}

const UploadFileModule: React.FC<IUploadFileModuleProps> = ({
  classNames,
  ...rest
}: IUploadFileModuleProps) => {
  const classes = useStyles()
  const { uploadFiles, currentPath } = useFPS()
  const [open, setOpen] = useState(false)

  const handleCloseDialog = () => setOpen(false)

  const UploadSchema = object().shape({
    files: array()
      .min(1, "Please select a file")
      .required("Please select a file to upload"),
  })

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="large"
        className={clsx(classes.cta, classNames?.button)}
        {...rest}
      >
        <UploadIcon />
        <Trans>Upload</Trans>
      </Button>
      <CustomModal active={open} closePosition="none" maxWidth="sm">
        <Formik
          initialValues={{
            files: [],
          }}
          validationSchema={UploadSchema}
          onSubmit={async (values, helpers) => {
            helpers.setSubmitting(true)
            try {
              uploadFiles(values.files, currentPath)
              helpers.resetForm()
              handleCloseDialog()
            } catch (errors) {
              if (errors[0].message.includes("conflict with existing")) {
                helpers.setFieldError("files", "File/Folder exists")
              } else {
                helpers.setFieldError("files", errors[0].message)
              }
            }
            helpers.setSubmitting(false)
          }}
        >
          <Form className={classes.root}>
            <FileInput
              multiple={true}
              className={classes.input}
              label="Upload Files and Folders"
              name="files"
            />
            <footer>
              <Button
                onClick={handleCloseDialog}
                size="medium"
                className={classes.cancelButton}
                variant="outline"
                type="button"
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button size="medium" type="submit" className={classes.okButton}>
                <Trans>Upload</Trans>
              </Button>
            </footer>
          </Form>
        </Formik>
      </CustomModal>
    </>
  )
}

export default UploadFileModule

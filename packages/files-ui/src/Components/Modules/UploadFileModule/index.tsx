import {
  Button,
  FileInput,
  IButtonProps,
  UploadIcon,
} from "@imploy/common-components"
import { useDrive, UploadProgress } from "../../../Contexts/DriveContext"
import { useImployApi } from "@imploy/common-contexts"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import React from "react"
import { useState } from "react"
import { Formik, Form } from "formik"
import clsx from "clsx"
import { array, object } from "yup"
import CustomModal from "../../Elements/CustomModal"
import UploadProgressModals from "./UploadProgressModals"
import { v4 as uuid } from "uuid"

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
  const { imployApiClient } = useImployApi()
  const {
    currentPath,
    uploadsInProgress,
    setUploadProgressCompleteEvent,
    setUploadProgressProgressEvent,
    setUploadsInProgress,
  } = useDrive()
  const [open, setOpen] = useState(false)

  const handleCloseDialog = () => setOpen(false)

  const UploadSchema = object().shape({
    files: array()
      .min(1, "Please select a file")
      .max(1, "File limit exceeded")
      .required("Please select a file to upload"),
  })

  // const onUploadFile = async () => {
  //   await uploadFile()
  // }

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
        Upload
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
              handleCloseDialog()
              helpers.resetForm()
              // ********************************
              const id = uuid()
              const file = values.files[0]
              const newUploadInProgress: UploadProgress = {
                id,
                complete: false,
                error: false,
                noOfFiles: 1,
                path: currentPath,
                progress: 0,
                fileName: file.name,
              }
              setUploadsInProgress([...uploadsInProgress, newUploadInProgress])
              await imployApiClient?.addCSFFiles(
                file,
                currentPath,
                undefined,
                (progressEvent) => {
                  setUploadProgressProgressEvent(
                    id,
                    Math.ceil(
                      (progressEvent.loaded / progressEvent.total) * 100,
                    ),
                  )
                },
              )
              setUploadProgressCompleteEvent(id)

              // ********************************
            } catch (errors) {
              console.log(errors)
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
              multiple={false}
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
                Cancel
              </Button>
              <Button size="medium" type="submit" className={classes.okButton}>
                Upload
              </Button>
            </footer>
          </Form>
        </Formik>
      </CustomModal>
      <UploadProgressModals />
    </>
  )
}

export default UploadFileModule

import { Button, FileInput } from "@chainsafe/common-components"
import { useDrive } from "../../Contexts/DriveContext"
import {
  createStyles,
  makeStyles,
} from "@chainsafe/common-theme"
import React, { useCallback, useState } from "react"
import { Formik, Form } from "formik"
import { array, object } from "yup"
import CustomModal from "../Elements/CustomModal"
import { Trans, t } from "@lingui/macro"
import clsx from "clsx"
import { CSFTheme } from "../../Themes/types"

const useStyles = makeStyles(({ constants, breakpoints }: CSFTheme) =>
  createStyles({
    root: {
      "& footer": {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: constants.uploadModal.background,
        padding: constants.generalUnit * 2,
      },
    },
    modalInner: {
      backgroundColor: constants.uploadModal.background,
      color: constants.uploadModal.color,
      [breakpoints.down("md")]: {
        maxWidth: `${breakpoints.width("md")}px !important`,
      },
    },
    input: {
      marginBottom: constants.generalUnit * 2,
    },
    cta: {},
    okButton: {
      marginLeft: constants.generalUnit,
      "&.wide": {
        paddingLeft: constants.generalUnit * 4,
        paddingRight: constants.generalUnit * 4,
      },
    },
    cancelButton: {},
    label: {
      fontSize: 14,
      lineHeight: "22px",
    },
    closeIcon: {
      "& svg": {
        fill: constants.uploadModal.icon,
      },
      
      "&:hover svg": {
        fill: constants.uploadModal.iconHover,
      }
    }
  }),
)

interface IUploadFileModuleProps {
  modalOpen: boolean
  close: () => void
}

const UploadFileModule: React.FC<IUploadFileModuleProps> = ({
  modalOpen,
  close,
}: IUploadFileModuleProps) => {
  const classes = useStyles()

  const [isDoneDisabled, setIsDoneDisabled] = useState(true)
  const { uploadFiles, currentPath } = useDrive()

  const UploadSchema = object().shape({
    files: array().required("Please select a file to upload"),
  })

  const onFileNumberChange = useCallback((filesNumber: number) => {
    setIsDoneDisabled(filesNumber === 0)
  }, [])

  return (
    <CustomModal
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
      injectedClass={{
        inner: classes.modalInner,
      }}
    >
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
            close()
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
            classNames={{
              closeIcon: classes.closeIcon
            }}
            label={t`Click or drag to upload files`}
            moreFilesLabel={t`Add more files`}
            maxSize={2 * 1024 ** 3}
            name="files"
            onFileNumberChange={onFileNumberChange}
          />
          <footer>
            <Button
              onClick={close}
              size="medium"
              className={classes.cancelButton}
              variant="outline"
              type="reset"
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              size="medium"
              type="submit"
              variant="primary"
              className={clsx(classes.okButton, "wide")}
              disabled={isDoneDisabled}
            >
              <Trans>Start Upload</Trans>
            </Button>
          </footer>
        </Form>
      </Formik>
    </CustomModal>
  )
}

export default UploadFileModule

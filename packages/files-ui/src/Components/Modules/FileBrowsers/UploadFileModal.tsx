import { Button, FileInput } from "@chainsafe/common-components"
import { useFiles } from "../../../Contexts/FilesContext"
import { createStyles, makeStyles } from "@chainsafe/common-theme"

import React, { useCallback, useState, useEffect } from "react"
import { Form, useFormik, FormikProvider } from "formik"
import CustomModal from "../../Elements/CustomModal"
import { Trans, t } from "@lingui/macro"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"
import { getPathWithFile } from "../../../Utils/pathUtils"
import { useFilesApi } from "../../../Contexts/FilesApiContext"

const useStyles = makeStyles(({ constants, breakpoints }: CSFTheme) =>
  createStyles({
    root: {
    },
    modalInner: {
      backgroundColor: constants.uploadModal.background,
      color: constants.uploadModal.color,
      [breakpoints.down("md")]: {
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    input: {
      marginBottom: constants.generalUnit * 2
    },
    fileList: {
      color: constants.uploadModal.color
    },
    item: {
      color: constants.uploadModal.color
    },
    cta: {},
    okButton: {
      marginLeft: constants.generalUnit,
      "&.wide": {
        paddingLeft: constants.generalUnit * 4,
        paddingRight: constants.generalUnit * 4
      }
    },
    cancelButton: {},
    label: {
      fontSize: 14,
      lineHeight: "22px"
    },
    addFiles: {
      backgroundColor: constants.uploadModal.addMoreBackground,
      color: constants.uploadModal.addMore,
      "& svg": {
        fill: constants.uploadModal.addMore
      }
    },
    closeIcon: {
      "& svg": {
        fill: constants.uploadModal.icon
      },
      "&:hover svg": {
        fill: constants.uploadModal.iconHover
      },
      "&:hover": {
        backgroundColor: "transparent"
      }
    },
    footer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      padding: constants.generalUnit * 2,
      backgroundColor: constants.uploadModal.footerBackground
    }
  })
)

interface IUploadFileModuleProps {
  modalOpen: boolean
  close: () => void
}

interface UploadedFiles {
  files: Array<File & {path: string}>
}

const UploadFileModule = ({ modalOpen, close }: IUploadFileModuleProps) => {
  const classes = useStyles()
  const [isDoneDisabled, setIsDoneDisabled] = useState(true)
  const { currentPath, refreshContents, bucket } = useFileBrowser()
  const { storageSummary, uploadFiles } = useFiles()
  const { filesApiClient } = useFilesApi()
  const [emptyFolders, setEmptyFolders] = useState<string[]>([])
  const [isTouched, setIsTouched] = useState(false)

  useEffect(() => {
    setEmptyFolders([])
  }, [])

  const onFileNumberChange = useCallback((filesNumber: number) => {
    setIsDoneDisabled(filesNumber === 0)
  }, [])

  const onSubmit = useCallback(async (values: UploadedFiles, helpers) => {
    if (!bucket) return

    helpers.setSubmitting(true)
    try {
      close()
      await values.files.length && uploadFiles(bucket, values.files, currentPath)

      //create empty dir
      if(emptyFolders.length){
        const allDirs = emptyFolders.map((folderPath) =>
          filesApiClient.addBucketDirectory(bucket.id, { path: getPathWithFile(currentPath, folderPath) })
        )

        await Promise.all(allDirs)
          .catch(console.error)
      }
      refreshContents && refreshContents()
      helpers.resetForm()
    } catch (error: any) {
      console.error(error)
    }
    helpers.setSubmitting(false)
  }, [bucket, close, uploadFiles, currentPath, emptyFolders, refreshContents, filesApiClient])

  const onFormikValidate = useCallback(({ files }: UploadedFiles) => {

    if (files.length === 0, isTouched) {
      return { files: t`Please select a file to upload` }
    }

    const availableStorage = storageSummary?.available_storage || 0
    const uploadSize = files?.reduce((total: number, file: File) => total += file.size, 0) || 0

    if(uploadSize > availableStorage)
      return { files: t`Upload size exceeds plan capacity` }
  },
  [storageSummary, isTouched])

  const formik = useFormik({
    initialValues: { files: [] },
    validate: onFormikValidate,
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    setIsTouched(formik.dirty)
  }, [formik])

  return (
    <CustomModal
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
      injectedClass={{ inner: classes.modalInner }}
    >
      <FormikProvider value={formik}>
        <Form
          data-cy="form-upload-file"
          className={classes.root}
        >
          <FileInput
            multiple={true}
            className={classes.input}
            classNames={{
              closeIcon: classes.closeIcon,
              filelist: classes.fileList,
              item: classes.item,
              addFiles: classes.addFiles
            }}
            label={t`Click or drag to upload files`}
            moreFilesLabel={t`Add more files`}
            maxSize={2 * 1024 ** 3}
            name="files"
            onFileNumberChange={onFileNumberChange}
            onEmptyFolderPathsChange={setEmptyFolders}
            testId="fileUpload"
          />
          <footer className={classes.footer}>
            <Button
              testId="cancel-upload"
              onClick={close}
              size="medium"
              className={classes.cancelButton}
              variant="outline"
              type="reset"
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              testId="start-upload"
              size="medium"
              type="submit"
              variant="primary"
              className={clsx(classes.okButton, "wide")}
              disabled={isDoneDisabled || !formik.isValid}
            >
              <Trans>Start Upload</Trans>
            </Button>
          </footer>
        </Form>
      </FormikProvider>
    </CustomModal>
  )
}

export default UploadFileModule

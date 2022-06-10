import { Button, FileInput } from "@chainsafe/common-components"
import { useStorage } from "../../../Contexts/StorageContext"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useCallback, useEffect, useState } from "react"
import { Formik, Form } from "formik"
import { array, object } from "yup"
import CustomModal from "../../Elements/CustomModal"
import { Trans, t } from "@lingui/macro"
import clsx from "clsx"
import { CSSTheme } from "../../../Themes/types"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"
import { useStorageApi } from "../../../Contexts/StorageApiContext"
import { getPathWithFile } from "../../../Utils/pathUtils"

const useStyles = makeStyles(({ constants, breakpoints }: CSSTheme) =>
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

const UploadFileModal = ({ modalOpen, close }: IUploadFileModuleProps) => {
  const classes = useStyles()
  const [isDoneDisabled, setIsDoneDisabled] = useState(true)
  const { uploadFiles } = useStorage()
  const { currentPath, refreshContents, bucket } = useFileBrowser()
  const { storageApiClient } = useStorageApi()
  const [emptyFolders, setEmptyFolders] = useState<string[]>([])

  const UploadSchema = object().shape({ files: array().required(t`Please select a file to upload`) })

  useEffect(() => {
    setEmptyFolders([])
  }, [])

  const onFileNumberChange = useCallback((filesNumber: number) => {
    setIsDoneDisabled(filesNumber === 0)
  }, [])

  const onSubmit = useCallback(async (values, helpers) => {
    if (!bucket) return

    helpers.setSubmitting(true)
    try {
      close()
      values.files.length && await uploadFiles(bucket.id, values.files, currentPath)

      //create empty dir
      if(emptyFolders.length){
        const allDirs = emptyFolders.map((folderPath) =>
          storageApiClient.addBucketDirectory(bucket.id, { path: getPathWithFile(currentPath, folderPath) })
        )

        await Promise.all(allDirs)
          .catch(console.error)
      }
      helpers.resetForm()
    } catch (error: any) {
      console.error(error)
    }

    refreshContents && refreshContents()
    helpers.setSubmitting(false)
  }, [bucket, close, uploadFiles, currentPath, emptyFolders, refreshContents, storageApiClient])

  return (
    <CustomModal
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
      injectedClass={{
        inner: classes.modalInner
      }}
    >
      <Formik
        initialValues={{ files: [] }}
        validationSchema={UploadSchema}
        onSubmit={onSubmit}
      >
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

export default UploadFileModal
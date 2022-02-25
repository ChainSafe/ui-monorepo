import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState } from "react"
import CustomModal from "../../Elements/CustomModal"
import { t, Trans } from "@lingui/macro"
import { Button, ShareAltSvg, TextInput, Typography } from "@chainsafe/common-components"
import { CSFTheme } from "../../../Themes/types"
import { useCallback } from "react"
import { useCreateOrEditSharedFolder } from "./hooks/useCreateOrEditSharedFolder"
import { BucketKeyPermission } from "../../../Contexts/FilesContext"
import clsx from "clsx"
import { useEffect } from "react"
import { nameValidator } from "../../../Utils/validationSchema"
import ManageSharedFolder from "./ManageSharedFolder"

const useStyles = makeStyles(
  ({ constants, palette, typography, zIndex }: CSFTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 3,
        flexDirection: "column",
        display: "flex"
      },
      modalRoot: {
        zIndex: zIndex?.blocker
      },
      modalInner: {
        backgroundColor: constants.fileInfoModal.background,
        color: constants.fileInfoModal.color
      },
      topIconContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      buttonsArea: {
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "column"
      },
      buttonsContainer: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: constants.generalUnit * 2
      },
      mainButton: {
        marginLeft: constants.generalUnit
      },
      cancelButton: {
        maxWidth: 100
      },
      heading: {
        color: constants.modalDefault.color,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: constants.generalUnit * 3
      },
      iconBacking: {
        backgroundColor: constants.modalDefault.iconBackingColor,
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: 8,
        "& > svg": {
          width: 16,
          height: 16,
          fill: palette.primary.main,
          position: "relative",
          display: "block",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%"
        }
      },
      inputLabel: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: constants.generalUnit
      },
      modalFlexItem: {
        width: "100%",
        marginBottom: constants.generalUnit * 2
      },
      newFolderInput: {
        margin: 0,
        width: "100%"
      },
      inputWrapper: {
        marginBottom: 0
      },
      errorText: {
        marginTop: constants.generalUnit * 1,
        color: palette.error.main
      }
    })
  }
)

interface ICreateSharedFolderModalProps {
  onClose: () => void
}

const CreateSharedFolderModal = ({ onClose }: ICreateSharedFolderModalProps) => {
  const { handleCreateSharedFolder } = useCreateOrEditSharedFolder()
  const [sharedFolderName, setSharedFolderName] = useState("")
  const [bucketToManage, setBucketToManage] = useState<BucketKeyPermission | undefined>()
  const [isFolderCreationLoading, setIsFolderCreationLoading] = useState(false)
  const [nameError, setNameError] = useState("")

  const classes = useStyles()

  useEffect(() => {
    setSharedFolderName("")
    setNameError("")
  }, [])

  const onNameChange = useCallback((value?: string | number) => {
    if (value === undefined) return

    const name = value.toString()
    setSharedFolderName(name)

    nameValidator
      .validate({ name })
      .then(() => {
        setNameError("")
      })
      .catch((e: Error) => {
        setNameError(e.message)
      })
  }, [])

  const handleCreate = useCallback(() => {
    setIsFolderCreationLoading(true)
    handleCreateSharedFolder(sharedFolderName, [], [])
      .then((newBucket) => {
        if (!newBucket) {
          return
        }
        setBucketToManage(newBucket)
      })
      .catch(console.error)
      .finally(() => setIsFolderCreationLoading(false))

  }, [handleCreateSharedFolder, sharedFolderName])

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{ inner: classes.modalInner }}
      active={true}
      closePosition="none"
      maxWidth={500}
      onClose={onClose}
      testId="create-shared-folder"
    >
      {bucketToManage
        ? <ManageSharedFolder
          onClose={onClose}
          bucketToEdit={bucketToManage}
        />
        : <div className={classes.root}>
          <div className={classes.topIconContainer}>
            <div className={classes.iconBacking}>
              <ShareAltSvg />
            </div>
            <div className={classes.heading}>
              <Typography className={classes.inputLabel}>
                <Trans>Create Shared Folder</Trans>
              </Typography>
            </div>
          </div>
          <div className={classes.modalFlexItem}>
            <div className={clsx(classes.modalFlexItem, classes.inputWrapper)}>
              <TextInput
                label={t`New shared folder name`}
                placeholder={t`Shared folder name`}
                className={classes.newFolderInput}
                labelClassName={classes.inputLabel}
                size="large"
                value={sharedFolderName}
                autoFocus
                onChange={onNameChange}
                state={nameError ? "error" : "normal"}
                data-cy="input-shared-folder-name"
              />
              {!!nameError && (
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.errorText}
                >
                  {nameError}
                </Typography>
              )}
            </div>
          </div>
          <div className={classes.buttonsArea}>
            <div className={classes.buttonsContainer}>
              <Button
                testId="cancel-creation"
                onClick={onClose}
                className={classes.cancelButton}
                variant="outline"
                type="reset"
                data-cy="button-cancel-create-shared-folder"
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleCreate}
                className={classes.mainButton}
                loading={isFolderCreationLoading}
                disabled={ !sharedFolderName || !!nameError}
                data-cy="button-create-shared-folder"
              >
                <Trans>Create</Trans>
              </Button>
            </div>
          </div>
        </div>
      }

    </CustomModal>
  )
}

export default CreateSharedFolderModal

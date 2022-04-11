import {
  Button,
  FormikTextInput,
  Grid,
  Typography
} from "@chainsafe/common-components"
import {
  createStyles,
  makeStyles,
  useMediaQuery
} from "@chainsafe/common-theme"
import React, { useState } from "react"
import { Formik, Form } from "formik"
import CustomModal from "../../Elements/CustomModal"
import CustomButton from "../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { CSSTheme } from "../../../Themes/types"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"
import { useStorageApi } from "../../../Contexts/StorageApiContext"
import { nameValidator } from "../../../Utils/validationSchema"
import { getPathWithFile } from "../../../Utils/pathUtils"


const useStyles = makeStyles(
  ({ breakpoints, constants, typography, zIndex }: CSSTheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
        flexDirection: "column"
      },
      modalRoot: {
        zIndex: zIndex?.blocker
      },
      modalInner: {
        backgroundColor: constants.createFolder.backgroundColor,
        color: constants.createFolder.color,
        [breakpoints.down("md")]: {
          bottom: Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`
        }
      },
      input: {
        marginBottom: constants.generalUnit * 2
      },
      okButton: {
        marginLeft: constants.generalUnit
      },
      cancelButton: {
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight
        }
      },
      label: {
        fontSize: 14,
        lineHeight: "22px"
      },
      heading: {
        color: constants.createFolder.color,
        fontWeight: typography.fontWeight.semibold,
        textAlign: "center",
        marginBottom: constants.generalUnit * 4
      }
    })
  }
)

interface ICreateFolderModalProps {
  modalOpen: boolean
  close: () => void
}

const CreateFolderModal = ({ modalOpen, close }: ICreateFolderModalProps) => {
  const classes = useStyles()
  const { storageApiClient } = useStorageApi()
  const { currentPath, refreshContents, bucket } = useFileBrowser()
  const [creatingFolder, setCreatingFolder] = useState(false)
  const desktop = useMediaQuery("md")

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <Formik
        initialValues={{
          name: ""
        }}
        validationSchema={nameValidator}
        validateOnChange={false}
        onSubmit={async (values, helpers) => {
          if (!bucket) return
          helpers.setSubmitting(true)
          try {
            setCreatingFolder(true)
            await storageApiClient.addBucketDirectory(bucket.id, { path: getPathWithFile(currentPath, values.name.trim()) })
            refreshContents && await refreshContents()
            setCreatingFolder(false)
            helpers.resetForm()
            close()
          } catch (error: any) {
            setCreatingFolder(false)
            if (error?.error?.code === 409) {
              helpers.setFieldError("name", t`Folder name is already in use`)
            } else {
              helpers.setFieldError("name", t`There was an error creating the folder ${error?.message}`)
            }
            helpers.setSubmitting(false)
          }
          helpers.setSubmitting(false)
        }}
        enableReinitialize
      >
        <Form>
          <div className={classes.root}>
            {!desktop && (
              <Grid
                item
                xs={12}
                sm={12}
              >
                <Typography
                  className={classes.heading}
                  variant="h5"
                  component="h5"
                >
                  <Trans>Create Folder</Trans>
                </Typography>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sm={12}
              className={classes.input}
            >
              <FormikTextInput
                name="name"
                size="large"
                placeholder={t`Name`}
                labelClassName={classes.label}
                label={t`Folder Name`}
                autoFocus
              />
            </Grid>
            <Grid
              item
              flexDirection="row"
              justifyContent="flex-end"
            >
              <CustomButton
                onClick={() => close()}
                size="medium"
                className={classes.cancelButton}
                variant={desktop ? "outline" : "gray"}
                type="button"
              >
                <Trans>Cancel</Trans>
              </CustomButton>
              <Button
                size={desktop ? "medium" : "large"}
                variant="primary"
                type="submit"
                className={classes.okButton}
                loading={creatingFolder}
              >
                {desktop ? <Trans>OK</Trans> : <Trans>Create</Trans>}
              </Button>
            </Grid>
          </div>
        </Form>
      </Formik>
    </CustomModal>
  )
}

export default CreateFolderModal

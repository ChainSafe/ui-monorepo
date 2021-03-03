import {
  Button,
  FormikTextInput,
  Grid,
  Typography,
} from "@chainsafe/common-components"
import { useDrive } from "../../Contexts/DriveContext"
import * as yup from "yup"
import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
} from "@chainsafe/common-theme"
import React, { useRef, useEffect, useState } from "react"
import { Formik, Form } from "formik"
import CustomModal from "../Elements/CustomModal"
import CustomButton from "../Elements/CustomButton"
import { Trans } from "@lingui/macro"
import { UI_COLORS } from "../../Themes/Constants"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography, zIndex }: ITheme<UI_COLORS>) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
        flexDirection: "column",
      },
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {},
      },
      modalInner: {
        backgroundColor: constants.createFolder.backgroundColor,
        color: constants.createFolder.color,
        [breakpoints.down("md")]: {
          bottom:
          Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`,
        },
      },
      input: {
        marginBottom: constants.generalUnit * 2,
      },
      okButton: {
        marginLeft: constants.generalUnit,
        backgroundColor: palette.common.black.main,
      },
      cancelButton: {
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight,
        },
      },
      label: {
        fontSize: 14,
        lineHeight: "22px",
      },
      heading: {
        color: constants.createFolder.color,
        fontWeight: typography.fontWeight.semibold,
        textAlign: "center",
        marginBottom: constants.generalUnit * 4,
      },
    })
  },
)

interface ICreateFolderModuleProps {
  modalOpen: boolean
  close: () => void
}

const CreateFolderModule: React.FC<ICreateFolderModuleProps> = ({
  modalOpen,
  close,
}: ICreateFolderModuleProps) => {
  const classes = useStyles()
  const { createFolder, currentPath } = useDrive()
  const [creatingFolder, setCreatingFolder] = useState(false)

  const desktop = useMediaQuery("md")
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [modalOpen])

  const folderNameValidator = yup.object().shape({
    name: yup.string().required("Folder name is required"),
  })

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner,
      }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={folderNameValidator}
        validateOnChange={false}
        onSubmit={async (values, helpers) => {
          helpers.setSubmitting(true)
          try {
            setCreatingFolder(true)
            await createFolder({ path: currentPath + values.name })
            setCreatingFolder(false)
            helpers.resetForm()
            close()
          } catch (errors) {
            setCreatingFolder(false)
            if (errors[0].message.includes("Entry with such name can")) {
              helpers.setFieldError("name", "Folder name is already in use")
            } else {
              helpers.setFieldError("name", errors[0].message)
            }
          }
          helpers.setSubmitting(false)
        }}
      >
        <Form>
          <div className={classes.root}>
            {!desktop && (
              <Grid item xs={12} sm={12}>
                <Typography
                  className={classes.heading}
                  variant="h5"
                  component="h5"
                >
                  <Trans>Create Folder</Trans>
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={12} className={classes.input}>
              <FormikTextInput
                name="name"
                size="large"
                placeholder="Name"
                labelClassName={classes.label}
                label="Folder Name"
                ref={inputRef}
              />
            </Grid>
            <Grid item flexDirection="row" justifyContent="flex-end">
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

export default CreateFolderModule

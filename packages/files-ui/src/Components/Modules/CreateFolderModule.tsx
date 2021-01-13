import {
  Button,
  FormikTextInput,
  Grid,
  Typography,
} from "@chainsafe/common-components"
import { useDrive } from "../../Contexts/DriveContext"

import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
} from "@chainsafe/common-theme"
import React from "react"
import { Formik, Form } from "formik"
import CustomModal from "../Elements/CustomModal"
import CustomButton from "../Elements/CustomButton"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography, zIndex }: ITheme) => {
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
        [breakpoints.down("md")]: {
          bottom:
            (constants?.mobileButtonHeight as number) + constants.generalUnit,
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
        color: palette.common.white.main,
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
  const { createFolder, currentPath, creatingFolder } = useDrive()

  const desktop = useMediaQuery("md")

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
        onSubmit={async (values, helpers) => {
          helpers.setSubmitting(true)
          try {
            await createFolder({ path: currentPath + values.name })
            helpers.resetForm()
            close()
          } catch (errors) {
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

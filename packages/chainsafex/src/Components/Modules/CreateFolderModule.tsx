import {
  Button,
  FormikTextInput,
  Grid,
  IButtonProps,
  PlusCircleIcon,
  Typography,
} from "@imploy/common-components"
import { useFPS } from "../../Contexts/FPSContext"

import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
} from "@imploy/common-themes"
import React from "react"
import { useState } from "react"
import { Formik, Form } from "formik"
import clsx from "clsx"
import CustomModal from "../Elements/CustomModal"
import CustomButton from "../Elements/CustomButton"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography }: ITheme) => {
    return createStyles({
      root: {
        padding: constants.generalUnit * 4,
      },
      modalRoot: {
        [breakpoints.down("md")]: {},
      },
      modalInner: {
        [breakpoints.down("md")]: {
          bottom:
            (constants?.mobileButtonHeight as number) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        },
      },
      createFolderButton: {},
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

interface ICreateFolderModuleProps extends IButtonProps {
  classNames?: {
    button?: string
  }
}

const CreateFolderModule: React.FC<ICreateFolderModuleProps> = ({
  classNames,
  ...rest
}: ICreateFolderModuleProps) => {
  const classes = useStyles()
  const { createFolder, currentPath } = useFPS()
  const [open, setOpen] = useState(false)

  const handleCloseDialog = () => setOpen(false)
  const desktop = useMediaQuery("md")

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="large"
        className={clsx(classes.createFolderButton, classNames?.button)}
        {...rest}
      >
        <PlusCircleIcon />
        <Trans>Create folder</Trans>
      </Button>
      <CustomModal
        className={classes.modalRoot}
        injectedClass={{
          inner: classes.modalInner,
        }}
        active={open}
        closePosition="none"
        maxWidth="md"
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
              handleCloseDialog()
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
            <Grid container flexDirection="column" className={classes.root}>
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
                  onClick={handleCloseDialog}
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
                >
                  {desktop ? <Trans>OK</Trans> : <Trans>Create</Trans>}
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </CustomModal>
    </>
  )
}

export default CreateFolderModule

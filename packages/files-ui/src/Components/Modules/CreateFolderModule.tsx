import {
  Button,
  FormikTextInput,
  Grid,
  PlusCircleIcon,
} from "@imploy/common-components"
import { useDrive } from "@imploy/common-contexts"
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

const useStyles = makeStyles(({ breakpoints, constants, palette }: ITheme) => {
  const mobileButtonHeight = 44
  return createStyles({
    root: {
      padding: constants.generalUnit * 4,
    },
    modalRoot: {
      [breakpoints.down("sm")]: {},
    },
    modalInner: {
      [breakpoints.down("sm")]: {
        bottom: mobileButtonHeight + constants.generalUnit,
        borderRadiusLeftBottom: `${constants.generalUnit * 1.5}px`,
        borderRadiusRightBottom: `${constants.generalUnit * 1.5}px`,
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
      [breakpoints.down("sm")]: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: mobileButtonHeight,
      },
    },
    label: {
      fontSize: 14,
      lineHeight: "22px",
    },
  })
})

const CreateFolderModule: React.FC<{ buttonClassName?: string }> = ({
  buttonClassName,
}) => {
  const classes = useStyles()
  const { createFolder, currentPath } = useDrive()
  const [open, setOpen] = useState(false)

  const handleCloseDialog = () => setOpen(false)
  const desktop = useMediaQuery("sm")

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="large"
        className={clsx(classes.createFolderButton, buttonClassName)}
      >
        <PlusCircleIcon />
        Create folder
      </Button>
      <CustomModal
        className={classes.modalRoot}
        injectedClass={{
          inner: classes.modalInner,
        }}
        active={open}
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
                  Cancel
                </CustomButton>
                <Button
                  size={desktop ? "medium" : "large"}
                  type="submit"
                  className={classes.okButton}
                >
                  OK
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

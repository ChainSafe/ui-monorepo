import {
  Button,
  FormikTextInput,
  Grid,
  Modal,
  PlusCircleIcon,
} from "@chainsafe/common-components"
import { useDrive } from "@chainsafe/common-contexts"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React from "react"
import { useState } from "react"
import { Formik, Form } from "formik"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, palette, typography }: ITheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit * 4,
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
    cancelButton: {},
    label: {
      fontSize: 14,
      lineHeight: "22px",
    },
  }),
)

const CreateFolder: React.FC<{ buttonClassName?: string }> = ({
  buttonClassName,
}) => {
  const classes = useStyles()
  const { createFolder, currentPath } = useDrive()
  const [open, setOpen] = useState(false)

  const handleCloseDialog = () => setOpen(false)

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
      <Modal active={open} closePosition="none" maxWidth="sm">
        <Formik
          initialValues={{
            name: "",
          }}
          onSubmit={async (values, helpers) => {
            helpers.setSubmitting(true)
            try {
              await createFolder({ path: currentPath + values.name })
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
              <Grid item xs={12} className={classes.input}>
                <FormikTextInput
                  name="name"
                  size="large"
                  placeholder="Name"
                  labelClassName={classes.label}
                  label="Folder Name"
                />
              </Grid>
              <Grid item flexDirection="row" justifyContent="flex-end">
                <Button
                  onClick={handleCloseDialog}
                  size="medium"
                  className={classes.cancelButton}
                  variant="outline"
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  size="medium"
                  type="submit"
                  className={classes.okButton}
                >
                  OK
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Modal>
    </>
  )
}

export default CreateFolder

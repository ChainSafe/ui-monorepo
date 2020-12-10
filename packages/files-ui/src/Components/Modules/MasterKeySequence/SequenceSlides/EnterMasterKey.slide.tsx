import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import {
  Button,
  FormikTextInput,
  Typography,
} from "@chainsafe/common-components"
import clsx from "clsx"
import { Form, Formik } from "formik"
import * as yup from "yup"
import { useDrive } from "../../../../Contexts/DriveContext"
import { useImployApi } from "@imploy/common-contexts"

const useStyles = makeStyles(({ constants, breakpoints }: ITheme) =>
  createStyles({
    root: {
      maxWidth: 320,
      "& h2": {
        textAlign: "center",
        marginBottom: constants.generalUnit * 4.125,
      },
      [breakpoints.down("md")]: {},
    },
    input: {
      margin: 0,
      marginBottom: constants.generalUnit * 1.5,
    },
    button: {
      marginTop: constants.generalUnit * 3,
    },
  }),
)

interface IEnterMasterKeySlide {
  className?: string
}

const EnterMasterKeySlide: React.FC<IEnterMasterKeySlide> = ({
  className,
}: IEnterMasterKeySlide) => {
  const classes = useStyles()
  const { validateMasterPassword } = useImployApi()
  const masterKeyValidation = yup.object().shape({
    masterKey: yup
      .string()
      .test("Key valid", "Master key invalid", async (value) => {
        try {
          console.log(await validateMasterPassword(`${value}`))
          return await validateMasterPassword(`${value}`)
        } catch (error) {
          return false
        }
      })
      .required("Please provide a master key"),
  })
  const { setMasterPassword } = useDrive()

  return (
    <section className={clsx(classes.root, className)}>
      <Formik
        initialValues={{
          masterKey: "",
        }}
        validateOnBlur={false}
        validationSchema={masterKeyValidation}
        onSubmit={async (values, helpers) => {
          helpers.setSubmitting(true)
          setMasterPassword(values.masterKey)
          helpers.setSubmitting(false)
        }}
      >
        <Form className={classes.root}>
          <Typography variant="h2" component="h2">
            Master key
          </Typography>
          <FormikTextInput
            className={classes.input}
            type="password"
            name="masterKey"
            label="Master Key"
          />
          <Button className={classes.button} fullsize type="submit">
            Continue
          </Button>
        </Form>
      </Formik>
    </section>
  )
}

export default EnterMasterKeySlide

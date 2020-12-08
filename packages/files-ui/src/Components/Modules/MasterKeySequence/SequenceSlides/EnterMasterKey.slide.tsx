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

const useStyles = makeStyles(({ breakpoints }: ITheme) =>
  createStyles({
    root: {
      [breakpoints.down("md")]: {},
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
  const masterKeyValidation = yup.object().shape({
    masterKey: yup.string().required("Please provide a master key"),
  })

  return (
    <section className={clsx(classes.root, className)}>
      <Formik
        initialValues={{
          masterKey: "",
          confirmMasterKey: "",
          privacyPolicy: false,
          terms: false,
        }}
        validationSchema={masterKeyValidation}
        onSubmit={async (values, helpers) => {
          helpers.setSubmitting(true)

          helpers.setSubmitting(false)
        }}
      >
        <Form className={classes.root}>
          <FormikTextInput name="masterKey" label="Master Key" />
          <Button type="submit">Continue</Button>
        </Form>
      </Formik>
      <footer>
        <Typography>Not registered yet?</Typography>
        <Typography>
          {/* TODO: Route to create an account */}
          Create an account
        </Typography>
      </footer>
    </section>
  )
}

export default EnterMasterKeySlide

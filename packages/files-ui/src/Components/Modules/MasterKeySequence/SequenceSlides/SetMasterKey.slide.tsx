import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import React from "react"
import {
  Button,
  FormikCheckboxInput,
  FormikTextInput,
  Link,
  TextInput,
  Typography,
} from "@chainsafe/common-components"
import clsx from "clsx"
import { Form, Formik } from "formik"
import * as yup from "yup"
import { ROUTE_LINKS } from "../../../FilesRoutes"

const useStyles = makeStyles(({ breakpoints }: ITheme) =>
  createStyles({
    root: {
      [breakpoints.down("md")]: {},
    },
  }),
)

interface ISetMasterKeySlide {
  className?: string
  postSubmit: () => void
}

const SetMasterKeySlide: React.FC<ISetMasterKeySlide> = ({
  className,
  postSubmit,
}: ISetMasterKeySlide) => {
  const classes = useStyles()

  const masterKeyValidation = yup.object().shape({
    masterKey: yup.string().required("Please provide a master key"),
    confirmMasterKey: yup
      .string()
      .oneOf([yup.ref("masterKey"), undefined], "Master key must match")
      .required("Master key confirm is required'"),
    privacyPolicy: yup.boolean().required("Please accept the privacy policy."),
    terms: yup.boolean().required("Please accept the terms & conditions."),
  })

  return (
    <section className={clsx(className)}>
      <Typography>A few things you should know....</Typography>
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
          postSubmit()
        }}
      >
        <Form className={classes.root}>
          <FormikTextInput name="masterKey" label="Master Key" />
          <FormikTextInput name="confirmMasterKey" label="Master Key" />
          <Typography>
            Please record your master password somewhere safe. <br /> Forgetting
            this password means{" "}
            <span>you are permanently locked out of your account.</span>
          </Typography>
          <FormikCheckboxInput
            name="privacyPolicy"
            label={
              <>
                I have read the{" "}
                <Link to={ROUTE_LINKS.PrivacyPolicy}>Privacy Policy</Link>
              </>
            }
          />
          <FormikCheckboxInput
            name="terms"
            label={
              <>
                I have read the{" "}
                <Link to={ROUTE_LINKS.Terms}>Terms of Service</Link>
              </>
            }
          />
          <Button type="submit">Set Master Key</Button>
        </Form>
      </Formik>
      <footer>
        <Typography>Already set up?</Typography>
        <Typography>
          {/* TODO: Route to Sign in */}
          Sign in
        </Typography>
      </footer>
    </section>
  )
}

export default SetMasterKeySlide

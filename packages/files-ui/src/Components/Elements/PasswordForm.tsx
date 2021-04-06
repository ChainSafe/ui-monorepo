import React, { useCallback, useMemo } from "react"
import { Button, FormikTextInput } from "@chainsafe/common-components"
import { Form, Formik } from "formik"
import { useState } from "react"
import * as yup from "yup"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import zxcvbn from "zxcvbn"
import { t } from "@lingui/macro"
import StrengthIndicator from "../Modules/MasterKeySequence/SequenceSlides/StrengthIndicator"

const useStyles = makeStyles(({  breakpoints, constants }: CSFTheme) =>
  createStyles({
    input: {
      margin: 0,
      width: "100%",
      marginBottom: constants.generalUnit * 1.5
    },
    inputLabel: {
      fontSize: "16px",
      lineHeight: "24px",
      marginBottom: constants.generalUnit
    },
    button: {
      [breakpoints.up("md")]: {
        marginTop: constants.generalUnit * 10
      },
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit
      }
    }
  })
)

interface Props {
  buttonLabel?: string
  setPassword: (password: string) => Promise<void>
}

const PasswordForm = ({ buttonLabel, setPassword }: Props) => {
  const [loading, setLoading] = useState(false)
  const classes = useStyles()
  const displayLabel = buttonLabel || t`Set Password`
  const passwordValidation = useMemo(() => yup.object().shape({
    password: yup
      .string()
      .test(
        "Complexity",
        t`Password needs to be more complex`,
        async (val: string | null | undefined | object) => {
          if (val === undefined) {
            return false
          }

          const complexity = zxcvbn(`${val}`)
          if (complexity.score >= 2) {
            return true
          }
          return false
        }
      )
      .required(t`Please provide a password`),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), undefined],
        t`Passwords must match`
      )
      .required(t`Password confirmation is required`)
  })
  , [])

  const onSubmit = useCallback((values, helpers) => {
    helpers.setSubmitting(true)
    setLoading(true)
    setPassword(values.password)
      .then(() => {
        setLoading(false)
        helpers.setSubmitting(false)
      })
      .catch ((e) => {
        setLoading(false)
        helpers.setSubmitting(false)
        console.error(e)
      })
  }, [setPassword])

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: ""
      }}
      validationSchema={passwordValidation}
      onSubmit={onSubmit}
    >
      <Form>
        <FormikTextInput
          type="password"
          className={classes.input}
          name="password"
          label={t`Password:`}
          labelClassName={classes.inputLabel}
          captionMessage={<StrengthIndicator fieldName="password" />}
        />
        <FormikTextInput
          type="password"
          className={classes.input}
          name="confirmPassword"
          label={t`Confirm Password:`}
          labelClassName={classes.inputLabel}
        />
        <Button
          className={classes.button}
          fullsize
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {displayLabel}
        </Button>
      </Form>
    </Formik>
  )
}

export default PasswordForm
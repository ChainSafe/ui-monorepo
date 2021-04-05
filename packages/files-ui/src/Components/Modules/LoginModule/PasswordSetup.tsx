import React, { useState } from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import * as yup from "yup"
import { Button, FormikTextInput, Typography, CloseSvg } from "@chainsafe/common-components"
import { Form, Formik } from "formik"
import StrengthIndicator from "../MasterKeySequence/SequenceSlides/StrengthIndicator"
import zxcvbn from "zxcvbn"
import { t, Trans } from "@lingui/macro"
import clsx from "clsx"

const useStyles = makeStyles(({  breakpoints, constants, typography }: CSFTheme) =>
  createStyles({
    root: {
      width: "100vw",
      [breakpoints.up("md")]: {
        padding: `${constants.generalUnit * 13.5}px ${constants.generalUnit * 9.5}px`,
        maxWidth: 580
      },
      [breakpoints.down("md")]: {
        padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 3}px`
      },
      "& p": {
        fontWeight: 400,
        marginBottom: constants.generalUnit * 2
      },
      "& h2": {
        fontWeight: typography.fontWeight.regular,
        marginBottom: constants.generalUnit * 1.5,
        [breakpoints.down("md")]: {
          textAlign: "center"
        }
      }
    },
    close: {
      position: "absolute",
      cursor: "pointer",
      "& svg": {
        width: 15,
        height: 15,
        stroke: constants.loginModule.textColor
      },
      [breakpoints.up("md")]: {
        top: constants.generalUnit * 3,
        right: constants.generalUnit * 3
      },
      [breakpoints.down("md")]: {
        top: constants.generalUnit * 1.5,
        right: constants.generalUnit * 1.5
      }
    },
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

interface IPasswordSetup {
  className?: string
  setPassword: (password: string) => Promise<void>
  cancel: () => void
}

const PasswordSetup = ({ setPassword, className, cancel }: IPasswordSetup) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const [loading, setLoading] = useState(false)

  const passwordValidation = yup.object().shape({
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

  return (
    <section className={clsx(classes.root, className)}>
      <div onClick={cancel} className={classes.close}>
        <CloseSvg />
      </div>
      <Typography variant={desktop ? "h2" : "h4"} component="h2">
        <Trans>
          Set up a password
        </Trans>
      </Typography>
      {
        desktop && (
          <Typography component="p">
            <Trans>
              You can change this later.
            </Trans>
          </Typography>
        )
      }
      <Formik
        initialValues={{
          password: "",
          confirmPassword: ""
        }}
        validationSchema={passwordValidation}
        onSubmit={async (values, helpers) => {
          helpers.setSubmitting(true)
          setLoading(true)
          await setPassword(values.password)
          setLoading(false)
          helpers.setSubmitting(false)
        }}
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
          <Button className={classes.button} fullsize type="submit" loading={loading} disabled={loading}>
            <Trans>
              Set Password
            </Trans>
          </Button>
        </Form>
      </Formik>
    </section>
  )
}

export default PasswordSetup

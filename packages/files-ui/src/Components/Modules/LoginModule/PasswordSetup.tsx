import React from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import * as yup from "yup"
import { Button, FormikTextInput, Typography, CloseSvg } from "@chainsafe/common-components"
import { Form, Formik } from "formik"
import StrengthIndicator from "../MasterKeySequence/SequenceSlides/StrengthIndicator"
import zxcvbn from "zxcvbn"
import { t, Trans } from "@lingui/macro"
import clsx from "clsx"

const useStyles = makeStyles(({ breakpoints, constants, typography }: CSFTheme) =>
  createStyles({
    root: {
      padding: `${constants.generalUnit * 13.5}px ${constants.generalUnit * 9.5}px`,
      [breakpoints.up("md")]: {
        maxWidth: 580,
        width: "100vw"
      },
      "& p": {
        fontWeight: 400,
        marginBottom: constants.generalUnit * 2,
        [breakpoints.up("md")]: {
          color: constants.masterKey.desktop.color
        },
        [breakpoints.down("md")]: {
          color: constants.masterKey.mobile.color
        }
      },
      "& h2": {
        fontWeight: typography.fontWeight.regular,
        marginBottom: constants.generalUnit * 1.5,
        [breakpoints.up("md")]: {
          color: constants.masterKey.desktop.color
        },
        [breakpoints.down("md")]: {
          color: constants.masterKey.mobile.color
        }
      }
    },
    close: {
      position: "absolute",
      top: constants.generalUnit * 3,
      right: constants.generalUnit * 3,
      cursor: "pointer",
      "& svg": {
        width: 15,
        height: 15
      }
    },
    input: {
      margin: 0,
      width: "100%",
      marginBottom: constants.generalUnit * 1.5,
      "& span": {
        [breakpoints.up("md")]: {
          color: constants.masterKey.desktop.color
        },
        [breakpoints.down("md")]: {
          color: constants.masterKey.mobile.color
        }
      }
    },
    inputLabel: {
      fontSize: "16px",
      lineHeight: "24px",
      [breakpoints.up("md")]: {
        color: constants.masterKey.desktop.color
      },
      [breakpoints.down("md")]: {
        color: constants.masterKey.mobile.color
      },
      marginBottom: constants.generalUnit
    },
    button: {
      marginTop: constants.generalUnit * 10
    }
  })
)

interface IPasswordSetup {
  className?: string
  setPassword: (password: string) => void
  cancel: () => void
}

const PasswordSetup: React.FC<IPasswordSetup> = ({ setPassword, className, cancel }: IPasswordSetup) => {
  const classes = useStyles()

  const passwordValidation = yup.object().shape({
    password: yup
      .string()
      .test(
        "Complexity",
        t`Encryption password needs to be more complex`,
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
      .required(t`Please provide an encryption password`),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("masterKey"), undefined],
        t`Encryption password must match`
      )
      .required(t`Encryption password confirmation is required`)
  })

  return (
    <section className={clsx(classes.root, className)}>
      <div onClick={cancel} className={classes.close}>
        <CloseSvg />
      </div>
      <Typography variant="h2" component="h2">
        <Trans>
          Set up a password
        </Trans>
      </Typography>
      <Typography component="p">
        <Trans>
          You can change this later.
        </Trans>
      </Typography>
      <Formik
        initialValues={{
          password: "",
          confirmPassword: ""
        }}
        validationSchema={passwordValidation}
        onSubmit={async (values, helpers) => {
          helpers.setSubmitting(true)
          // secureDrive(values.masterKey)
          setPassword(values.password)
          helpers.setSubmitting(false)
        }}
      >
        <Form>
          <FormikTextInput
            type="password"
            className={classes.input}
            name="password"
            label={t`Encryption Password:`}
            labelClassName={classes.inputLabel}
            captionMessage={<StrengthIndicator fieldName="password" />}
          />
          <FormikTextInput
            type="password"
            className={classes.input}
            name="confirmPassword"
            label={t`Confirm Encryption Password:`}
            labelClassName={classes.inputLabel}
          />
          <Button className={classes.button} fullsize type="submit">
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

import React, { useState, useCallback, useMemo } from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, Emoji, FormikTextInput, Typography } from "@chainsafe/common-components"
import { Trans, t } from "@lingui/macro"
import clsx from "clsx"
import { Form, Formik } from "formik"
import * as yup from "yup"
import { useFilesApi } from "@chainsafe/common-contexts"

const useStyles = makeStyles(({ palette, breakpoints, constants }: CSFTheme) =>
  createStyles({
    root: {
      width: "100vw",
      [breakpoints.up("md")]: {
        padding: `${constants.generalUnit * 4}px ${constants.generalUnit * 15}px`,
        maxWidth: 580
      },
      [breakpoints.down("md")]: {
        padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 3}px`
      }
    },
    headerText: {
      textAlign: "center",
      [breakpoints.up("md")]: {
        paddingBottom: constants.generalUnit * 4
      },
      [breakpoints.down("md")]: {
        paddingBottom: constants.generalUnit * 3
      }
    },
    input: {
      margin: 0,
      width: "100%",
      marginBottom: constants.generalUnit
    },
    inputLabel: {
      fontSize: "16px",
      lineHeight: "24px",
      marginBottom: constants.generalUnit
    },
    button: {
      [breakpoints.up("md")]: {
        marginTop: constants.generalUnit
      },
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit
      }
    },
    buttonLink: {
      color: palette.additional["gray"][10],
      outline: "none",
      textDecoration: "underline",
      cursor: "pointer",
      textAlign: "center",
      marginTop: constants.generalUnit * 2,
      "&.disabled": {
        color: palette.additional["gray"][7]
      },
      "&.spaceLeft": {
        marginLeft: constants.generalUnit * 0.5
      }
    },
    title: {
      textAlign: "center"
    },
    subtitle: {
      textAlign: "center",
      paddingTop: constants.generalUnit * 4,
      paddingBottom: constants.generalUnit * 4
    },
    resendText: {
      textAlign: "center",
      marginTop: constants.generalUnit * 4
    },
    errorText: {
      textAlign: "center",
      color: palette.error.main
    }
  })
)

interface IPasswordlessEmail {
  resetLogin: () => void
}

const PasswordlessEmail = ({ resetLogin }: IPasswordlessEmail) => {
  const classes = useStyles()
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingEmailResend, setLoadingEmailResend] = useState(false)
  const [loadingVerificationCode, setLoadingVerificationCode] = useState(false)
  const [page, setPage] = useState<"page1" | "page2">("page1")
  const [email, setEmail] = useState<string | undefined>()
  const [hasEmailResent, setHasEmailResent] = useState(false)
  const { filesApiClient } = useFilesApi()
  const [error, setError] = useState<string | undefined>()

  const emailValidation = useMemo(() => yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required")
  })
  , [])

  const verificationCodeValidation = useMemo(() => yup.object().shape({
    verificationCode: yup
      .string()
      .required("Verification code is required")
  })
  , [])

  const onSubmitEmail = useCallback((values) => {
    setLoadingEmail(true)
    setError(undefined)
    filesApiClient.getIdentityEmailToken(values.email)
      .then(() => {
        setEmail(values.email)
        setPage("page2")
        setLoadingEmail(false)
      }).catch ((e) => {
        setError("Something went wrong!")
        setLoadingEmail(false)
        console.error(e)
      })
  }, [filesApiClient])

  const onSubmitVerificationCode = useCallback((values) => {
    if (!email) return
    setLoadingVerificationCode(true)
    setError(undefined)
    filesApiClient.postIdentityEmailToken({
      email: email,
      nonce: values.verificationCode
    }).then(() => {
      setLoadingVerificationCode(false)
    })
      .catch ((e) => {
        setError(t`Something went wrong!`)
        setLoadingVerificationCode(false)
        console.error(e)
      })
  }, [filesApiClient, email])

  const onResendEmail = useCallback(() => {
    if (!email) return
    setLoadingEmailResend(true)
    filesApiClient.getIdentityEmailToken(email)
      .then(() => {
        setHasEmailResent(true)
        setLoadingEmailResend(false)
      })
      .catch ((e) => {
        setLoadingEmailResend(false)
        console.error(e)
      })
  }, [filesApiClient, email])

  return (
    <section className={clsx(classes.root)}>
      <Typography
        variant="h6"
        component="h6"
        className={classes.headerText}
      >
        <Trans>
          Sign in
        </Trans>
      </Typography>
      {page === "page1" ? (<Formik
        initialValues={{
          email: ""
        }}
        validationSchema={emailValidation}
        onSubmit={onSubmitEmail}
      >
        <Form>
          <FormikTextInput
            className={classes.input}
            name="email"
            label={t`Enter your email:`}
            labelClassName={classes.inputLabel}
          />
          {error && (
            <Typography component="p"
              variant="body1"
              className={classes.errorText}>{error}</Typography>
          )}
          <Button
            className={clsx(classes.button)}
            variant="primary"
            fullsize
            type="submit"
            loading={loadingEmail}
            disabled={loadingEmail}
          >
            <Trans>Continue</Trans>
          </Button>
        </Form>
      </Formik>
      ) : (
        <Formik
          initialValues={{
            verificationCode: ""
          }}
          validationSchema={verificationCodeValidation}
          onSubmit={onSubmitVerificationCode}
        >
          <Form>
            <Typography
              variant="h3"
              component="h3"
              className={classes.title}
            >
              <Trans>Verification code sent!</Trans> <Emoji symbol="✨" />
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.subtitle}
            >
              {t`We’ve sent an email to`} {email}. {t`It contains a verification code that’ll sign you in super quickly!` }
            </Typography>
            <FormikTextInput
              className={classes.input}
              name="verificationCode"
              label={t`Enter the verification code:`}
              labelClassName={classes.inputLabel}
            />
            {error && (
              <Typography component="p"
                variant="body1"
                className={classes.errorText}>{error}</Typography>
            )}
            <Button
              className={clsx(classes.button)}
              variant="primary"
              fullsize
              type="submit"
              loading={loadingVerificationCode}
              disabled={loadingVerificationCode}
            >
              <Trans>Continue</Trans>
            </Button>

            {!hasEmailResent ? (
              <Typography
                className={classes.resendText}
                component="p"
                variant="body1"
              >
                <span>
                  <Trans>
                    Didn&apos;t receive the email ?
                  </Trans>
                </span>
                <span
                  className={clsx(classes.buttonLink, "spaceLeft", loadingEmailResend && "disabled")}
                  onClick={onResendEmail}
                >
                  <Trans>
                    Send another email
                  </Trans>
                </span>
              </Typography>
            ) : (
              <Typography
                className={classes.resendText}
                component="p"
                variant="body1"
              >
                <span>
                  <Trans>
                    Check your inbox! We&apos;ve sent another email
                  </Trans>
                </span>
              </Typography>
            )}
          </Form>
        </Formik>

      )}
      <div
        className={classes.buttonLink}
        onClick={resetLogin}
      >
        <Typography><Trans>Go back</Trans></Typography>
      </div>
    </section>
  )
}

export default PasswordlessEmail

import React, { useState, useCallback, useMemo } from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Button, Emoji, FormikTextInput, Typography } from "@chainsafe/common-components"
import { Trans, t } from "@lingui/macro"
import clsx from "clsx"
import { Form, Formik } from "formik"
import * as yup from "yup"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"

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
  const [isSubmitEmailLoading, setIsSubmitEmailLoading] = useState(false)
  const [isSubmitResendEmailLoading, setIsSubmitResendEmailLoading] = useState(false)
  const [isSubmitNonceLoading, setIsSubmitNonceLoading] = useState(false)
  const [page, setPage] = useState<"confirmEmail" | "confirmVerificationCode">("confirmEmail")
  const [email, setEmail] = useState<string | undefined>()
  const [hasEmailResent, setHasEmailResent] = useState(false)
  const { filesApiClient } = useFilesApi()
  const { login } = useThresholdKey()
  const [error, setError] = useState<string | undefined>()

  const emailValidation = useMemo(() => yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required(t`Email is required`)
  })
  , [])

  const nonceValidation = useMemo(() => yup.object().shape({
    nonce: yup
      .string()
      .required(t`Verification code is required`)
  })
  , [])

  const onSubmitEmail = useCallback((values) => {
    setIsSubmitEmailLoading(true)
    setError(undefined)
    filesApiClient.getIdentityEmailToken({ email: values.email })
      .then(() => {
        setEmail(values.email)
        setPage("confirmVerificationCode")
        setIsSubmitEmailLoading(false)
      }).catch ((e) => {
        setError(t`Something went wrong!`)
        setIsSubmitEmailLoading(false)
        console.error(e)
      })
  }, [filesApiClient])

  const onSubmitNonce = useCallback((values) => {
    if (!email) return
    setIsSubmitNonceLoading(true)
    setError(undefined)
    filesApiClient.postIdentityEmailToken({
      email: email,
      nonce: values.nonce
    }).then(async (data) => {
      await login("email", { token: data.token || "", email })
      setIsSubmitNonceLoading(false)
    }).catch ((e) => {
      if (e && e[0] && e[0].type === "nonce") {
        setError(t`Verification code not correct!`)
      } else {
        setError(t`Something went wrong!`)
      }
      setIsSubmitNonceLoading(false)
      console.error(e)
    })
  }, [filesApiClient, email, login])

  const onResendEmail = useCallback(() => {
    if (!email) return
    setIsSubmitResendEmailLoading(true)
    filesApiClient.getIdentityEmailToken({ email }).then(() => {
      setHasEmailResent(true)
      setIsSubmitResendEmailLoading(false)
    }).catch ((e) => {
      setIsSubmitResendEmailLoading(false)
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
      {page === "confirmEmail"
        ? <Formik
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
              loading={isSubmitEmailLoading}
              disabled={isSubmitEmailLoading}
            >
              <Trans>Continue</Trans>
            </Button>
          </Form>
        </Formik>
        : <>
          <Formik
            initialValues={{
              nonce: ""
            }}
            validationSchema={nonceValidation}
            onSubmit={onSubmitNonce}
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
                <Trans>We’ve sent an email to {email}. It contains a verification code that’ll sign you in super quickly!</Trans>
              </Typography>
              <FormikTextInput
                className={classes.input}
                name="nonce"
                label={t`Enter the verification code:`}
                labelClassName={classes.inputLabel}
              />
              {error && (
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.errorText}
                >
                  {error}
                </Typography>
              )}
              <Button
                className={clsx(classes.button)}
                variant="primary"
                fullsize
                type="submit"
                loading={isSubmitNonceLoading}
                disabled={isSubmitNonceLoading}
              >
                <Trans>Continue</Trans>
              </Button>
            </Form>
          </Formik>

          {!hasEmailResent
            ? <Typography
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
                className={clsx(classes.buttonLink, "spaceLeft", isSubmitResendEmailLoading && "disabled")}
                onClick={onResendEmail}
              >
                <Trans>
                    Send another email
                </Trans>
              </span>
            </Typography>
            : <Typography
              className={classes.resendText}
              component="p"
              variant="body1"
            >
              <span>
                <Trans>
                    Check your inbox! We&apos;ve sent another email.
                </Trans>
              </span>
            </Typography>
          }
        </>
      }
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

import {
  createStyles,
  ITheme,
  makeStyles,
} from "@chainsafe/common-theme"
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
import { useImployApi, useUser } from "@imploy/common-contexts"
import { UI_COLORS } from "../../../../Themes/Constants"

const useStyles = makeStyles(
  ({ constants, breakpoints, palette, typography }: ITheme) =>
    createStyles({
      root: {
        maxWidth: 320,
        "& h2": {
          textAlign: "center",
          marginBottom: constants.generalUnit * 4.125,
          [breakpoints.down("md")]: {
          },
        },
      },
      input: {
        width: "100%",
        margin: 0,
        marginBottom: constants.generalUnit * 1.5,
        "& span": {
          [breakpoints.down("md")]: {
            // color: palette.common.white.main,
          },
        },
      },
      inputLabel: {
        fontSize: "16px",
        lineHeight: "24px",
        // color: palette.additional["gray"][10],
        marginBottom: constants.generalUnit,
      },
      button: {
        marginTop: constants.generalUnit * 3,
      },
      userContainer: {
        marginTop: constants.generalUnit * 4,
        [breakpoints.down("md")]: {
          color: palette.common.white.main,
        },
      },
      logoutButton: {
        padding: 0,
        textDecoration: "underline",
        border: "none",
        cursor: "pointer",
        backgroundColor: "transparent",
        ...typography.body1,
        color: (constants as UI_COLORS).masterkey.color,
        [breakpoints.down("md")]: {
          color: (constants as UI_COLORS).masterkey.color,
        },
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
  const { validateMasterPassword, logout } = useImployApi()
  const { getProfileTitle } = useUser()
  const masterKeyValidation = yup.object().shape({
    masterKey: yup
      .string()
      .test(
        "Key valid",
        "Encryption password is invalid",
        async (value: string | null | undefined | object) => {
          try {
            return await validateMasterPassword(`${value}`)
          } catch (error) {
            return false
          }
        },
      )
      .required("Please provide an encryption password"),
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
            Encryption Password
          </Typography>
          <FormikTextInput
            className={classes.input}
            type="password"
            name="masterKey"
            label="Enter encryption password:"
            labelClassName={classes.inputLabel}
          />
          <Button className={classes.button} fullsize type="submit">
            Continue
          </Button>
        </Form>
      </Formik>
      <div className={classes.userContainer}>
        <Typography>Signed in as:</Typography>
        <br />
        <Typography>
          <b>{getProfileTitle()}</b>
        </Typography>
        <br />
        <button className={classes.logoutButton} onClick={logout}>
          Log out
        </button>
      </div>
    </section>
  )
}

export default EnterMasterKeySlide

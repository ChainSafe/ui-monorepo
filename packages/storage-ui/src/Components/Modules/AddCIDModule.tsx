import React, { useRef, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Button, FormikTextInput, Grid, Typography } from "@chainsafe/common-components"
import CustomModal from "../Elements/CustomModal"
import { CSSTheme } from "../../Themes/types"
import CustomButton from "../Elements/CustomButton"
import { Trans } from "@lingui/macro"
import * as yup from "yup"
import { Formik, Form } from "formik"
import CID, { isCID,  } from "cids"
import { useStorage } from "../../Contexts/StorageContext"

const useStyles = makeStyles(({ constants, breakpoints, zIndex, typography }: CSSTheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit * 4,
      flexDirection: "column"
    },
    modalRoot: {
      zIndex: zIndex?.blocker,
      [breakpoints.down("md")]: {}
    },
    modalInner: {
      backgroundColor: constants.createFolder.backgroundColor,
      color: constants.createFolder.color,
      [breakpoints.down("md")]: {
        bottom:
        Number(constants?.mobileButtonHeight) + constants.generalUnit,
        borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    input: {
      marginBottom: constants.generalUnit * 2
    },
    okButton: {
      marginLeft: constants.generalUnit
    },
    cancelButton: {
      [breakpoints.down("md")]: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: constants?.mobileButtonHeight
      }
    },
    label: {
      fontSize: 14,
      lineHeight: "22px"
    },
    heading: {
      color: constants.createFolder.color,
      marginBottom: constants.generalUnit
    }
  })
)

interface IAddCIDModuleProps {
  modalOpen: boolean
  close: () => void
}

const AddCIDModule = ({
  modalOpen = false,
  close
}: IAddCIDModuleProps) => {
  const classes = useStyles()

  const { addPin } = useStorage()

  const cidValidator = yup.object().shape({
    cid: yup
      .string()
      .required("CID is required")
      .test(
        "IsValidCID",
        "CID invalid",
        value => {
          try {
            return isCID(new CID(`${value}`))
          }
          catch (error) {
            debugger
            return false
          }
         
        }
      )
  })
  const inputRef = useRef<any>(null)
  const [accessingCID, setAccessingCID] = useState(false)

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <Formik
        initialValues={{
          cid: ""
        }}
        validationSchema={cidValidator}
        validateOnChange={false}
        onSubmit={async (values, helpers) => {
          helpers.setSubmitting(true)
          try {
            setAccessingCID(true)
            await addPin(values.cid)
            setAccessingCID(false)
            helpers.resetForm()
            close()
          } catch (errors) {
            setAccessingCID(false)
            helpers.setFieldError("cid", errors[0].message)
          }
          helpers.setSubmitting(false)
        }}
      >
        <Form>
          <div className={classes.root}>
            <Grid
              item
              xs={12}
              sm={12}
            >
              <Typography
                className={classes.heading}
                variant="h5"
                component="h5"
              >
                <Trans>Paste the CID to host a file with ChainSafe Storage</Trans>
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              className={classes.input}
            >
              <FormikTextInput
                name="cid"
                size="large"
                placeholder="QmNbbf...dps2Xw"
                labelClassName={classes.label}
                label="CID"
                ref={inputRef}
              />
            </Grid>
            <Grid
              item
              flexDirection="row"
              justifyContent="flex-end"
            >
              <CustomButton
                onClick={() => close()}
                size="medium"
                className={classes.cancelButton}
                variant={"outline"}
                type="button"
              >
                <Trans>Cancel</Trans>
              </CustomButton>
              <Button
                size={"medium"}
                variant="primary"
                type="submit"
                className={classes.okButton}
                loading={accessingCID}
              >
                <Trans>Start Upload</Trans>
              </Button>
            </Grid>
          </div>
        </Form>
      </Formik>
    </CustomModal>
  )
}

export default AddCIDModule

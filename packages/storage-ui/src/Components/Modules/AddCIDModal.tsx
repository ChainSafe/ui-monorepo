import React, { useCallback, useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Button, Grid, TextInput, Typography } from "@chainsafe/common-components"
import CustomModal from "../Elements/CustomModal"
import { CSSTheme } from "../../Themes/types"
import CustomButton from "../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { useStorage } from "../../Contexts/StorageContext"
import { cidValidator } from "../../Utils/validationSchema"

const useStyles = makeStyles(({ constants, breakpoints, zIndex, palette, typography }: CSSTheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit * 4,
      flexDirection: "column"
    },
    modalRoot: {
      zIndex: zIndex?.blocker
    },
    modalInner: {
      backgroundColor: constants.createFolder.backgroundColor,
      color: constants.createFolder.color,
      width: "100%",
      [breakpoints.down("md")]: {
        bottom: Number(constants?.mobileButtonHeight) + constants.generalUnit,
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
    heading: {
      color: constants.createFolder.color,
      fontWeight: typography.fontWeight.semibold,
      textAlign: "center",
      marginBottom: constants.generalUnit * 2
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: 600,
      marginBottom: constants.generalUnit
    },
    cidInput: {
      margin: 0,
      width: "100%",
      marginTop: constants.generalUnit * 2
    },
    errorText: {
      marginTop: constants.generalUnit * 1,
      color: palette.error.main
    },
    warningText: {
      marginTop: constants.generalUnit * 1,
      color: palette.warning.main
    }
  })
)

interface IAddCIDModuleProps {
  modalOpen: boolean
  close: () => void
}

const AddCIDModal = ({ modalOpen = false, close }: IAddCIDModuleProps) => {
  const classes = useStyles()
  const { addPin, refreshPins, searchCid } = useStorage()
  const [accessingCID, setAccessingCID] = useState(false)
  const [cidError, setCidError] = useState("")
  const [cid, setCid] = useState("")
  const [showWarning, setShowWarning] = useState(false)
  const [name, setName] = useState("")

  const onClose = useCallback(() => {
    setCid("")
    setShowWarning(false)
    setCidError("")
    setName("")
    close()
  }, [close])

  const onSubmit = useCallback(() => {
    if (!cid) return

    setAccessingCID(true)

    addPin(cid.trim(), name.trim())
      .then(() => {
        onClose()
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        refreshPins(undefined)
        setAccessingCID(false)
      })
  }, [addPin, cid, name, onClose, refreshPins])

  useEffect(() => {
    if (!cid) return

    cidValidator
      .validate({ cid: cid.trim() })
      .then(() => {
        searchCid(cid)
          .then((res) => {
            if(res && res.results?.length){
              setShowWarning(true)
            }
          })
          .catch(console.error)
      })
      .catch((e: Error) => {
        setCidError(e.message)
      })
  }, [cid, cidError, searchCid])

  const onCidChange = useCallback((cid?: string | number) => {
    setCidError("")
    setShowWarning(false)

    setCid(cid?.toString() || "")
  }, [])

  const onNameChange = useCallback((name?: string | number) => {
    setName(name?.toString() || "")
  }, [])

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{ inner: classes.modalInner }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
      testId="add-cid"
    >
      <div className={classes.root}>
        <Grid
          item
          xs={12}
          sm={12}
          className={classes.input}
        >
          <Typography
            className={classes.heading}
            variant="h5"
            component="h5"
          >
            <Trans>Pin a CID</Trans>
          </Typography>
          <TextInput
            label={t`Name (optional)`}
            placeholder="Cute cat image"
            className={classes.cidInput}
            labelClassName={classes.inputLabel}
            size="large"
            value={name}
            autoFocus
            onChange={onNameChange}
            data-cy="input-cid-name"
          />
          <TextInput
            label={t`CID to pin`}
            placeholder="QmNbbf...dps2Xw"
            className={classes.cidInput}
            labelClassName={classes.inputLabel}
            size="large"
            value={cid}
            onChange={onCidChange}
            state={cidError ? "error" : showWarning ?  "warning" : "normal"}
            data-cy="input-cid"
          />
          {!!cidError && (
            <Typography
              component="p"
              variant="body1"
              className={classes.errorText}
            >
              {cidError}
            </Typography>
          )}
          {showWarning && (
            <Typography
              component="p"
              variant="body1"
              className={classes.warningText}
              data-cy="label-cid-pinned-warning"
            >
              <Trans>Warning: CID already pinned</Trans>
            </Typography>
          )}
        </Grid>
        <Grid
          item
          flexDirection="row"
          justifyContent="flex-end"
        >
          <CustomButton
            onClick={() => onClose()}
            size="medium"
            className={classes.cancelButton}
            variant={"outline"}
            type="button"
            data-cy="button-cancel-add-pin"
          >
            <Trans>Cancel</Trans>
          </CustomButton>
          <Button
            size={"medium"}
            variant="primary"
            onClick={onSubmit}
            className={classes.okButton}
            loading={accessingCID}
            data-cy="button-submit-pin"
            disabled={!!cidError}
          >
            <Trans>Pin</Trans>
          </Button>
        </Grid>
      </div>
    </CustomModal>
  )
}

export default AddCIDModal

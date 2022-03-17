import React, { useCallback, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { Button, Grid, TextInput, Typography } from "@chainsafe/common-components"
import CustomModal from "../Elements/CustomModal"
import { CSSTheme } from "../../Themes/types"
import CustomButton from "../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { useStorage } from "../../Contexts/StorageContext"
import { cidValidator } from "../../Utils/validationSchema"

const useStyles = makeStyles(({ constants, breakpoints, zIndex, palette }: CSSTheme) =>
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
    heading: {
      color: constants.createFolder.color,
      marginBottom: constants.generalUnit
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: 600,
      marginBottom: constants.generalUnit
    },
    modalFlexItem: {
      width: "100%",
      marginBottom: constants.generalUnit * 2
    },
    newFolderInput: {
      margin: 0,
      width: "100%"
    },
    inputWrapper: {
      marginBottom: 0
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

  const onClose = useCallback(() => {
    setCid("")
    setShowWarning(false)
    setCidError("")
    close()
  }, [close])

  const onSubmit = useCallback(() => {
    setAccessingCID(true)
    addPin(cid.trim())
      .then(() => {
        onClose()
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        refreshPins()
        setAccessingCID(false)
      })
  }, [addPin, cid, onClose, refreshPins])

  const checkIfCidDuplicate = useCallback(() => {
    searchCid(cid)
      .then((res) => {
        if(res && res.results?.length){
          setShowWarning(true)
        }
      })
  }, [cid, searchCid])

  const onCidChange = useCallback((cid?: string | number) => {
    setCidError("")
    setShowWarning(false)

    cid && setCid(cid?.toString())

    cidValidator
      .validate({ cid })
      .then(() => {
        setCidError("")
        checkIfCidDuplicate()
      })
      .catch((e: Error) => {
        setCidError(e.message)
      })
  }, [checkIfCidDuplicate])

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{ inner: classes.modalInner }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <div
        className={classes.root}
        data-cy="form-pin-cid"
      >
        <Grid
          item
          xs={12}
          sm={12}
          className={classes.input}
        >
          <TextInput
            label={t`Paste the CID to pin it with ChainSafe Storage`}
            placeholder="QmNbbf...dps2Xw"
            className={classes.newFolderInput}
            labelClassName={classes.inputLabel}
            size="large"
            value={cid}
            autoFocus
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
            >
              <Trans>Warning: cid already pinned</Trans>
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
          >
            <Trans>Pin</Trans>
          </Button>
        </Grid>
      </div>
    </CustomModal>
  )
}

export default AddCIDModal

import { Button, CopyIcon, Modal, PlusIcon, Typography } from "@chainsafe/common-components"
import { createStyles, debounce, makeStyles } from "@chainsafe/common-theme"
import { AccessKey } from "@chainsafe/files-api-client"
import { Trans } from "@lingui/macro"
import React, { useCallback, useEffect, useState } from "react"
import { useGamingApi } from "../../Contexts/GamingApiContext"
import { CSGTheme } from "../../Themes/types"
import ApiKeyCard from "../Elements/ApiKeyCard"

const useStyles = makeStyles(({ breakpoints, constants, palette, zIndex }: CSGTheme) =>
  createStyles({
    root: {
      position: "relative",
      margin: constants.generalUnit
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit
      }
    },
    controls: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > button": {
        marginLeft: constants.generalUnit
      }
    },
    dataArea: {
      marginTop: constants.generalUnit * 2,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      "& > *": {
        margin: constants.generalUnit,
        width:"100%",
        [breakpoints.up("xs")]: {
          maxWidth: `calc(100% - ${constants.generalUnit * 2}px)`
        },
        [breakpoints.up("sm")]: {
          maxWidth: `calc(50% - ${constants.generalUnit * 2}px)`
        },
        [breakpoints.up("md")]: {
          maxWidth: `calc(33% - ${constants.generalUnit * 2}px)`
        },
        [breakpoints.up("lg")]: {
          maxWidth: `calc(25% - ${constants.generalUnit * 2}px)`
        },
        [breakpoints.up("xl")]: {
          maxWidth: `calc(20% - ${constants.generalUnit * 2}px)`
        }
      }
    },
    modalRoot: {
      zIndex: zIndex?.blocker,
      [breakpoints.down("md")]: {}
    },
    modalInner: {
      [breakpoints.down("md")]: {
        bottom:
        Number(constants?.mobileButtonHeight) + constants.generalUnit,
        borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    modalHeading: {
      textAlign: "center",
      marginBottom: constants.generalUnit * 4
    },
    modalContent: {
      display: "flex",
      flexDirection: "column",
      padding: constants.generalUnit * 4
    },
    secretContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: constants.generalUnit * 0.5
    },
    copyBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      color: palette.text.secondary
    },
    copyIcon: {
      fontSize: "14px",
      fill: constants.profile.icon,
      [breakpoints.down("md")]: {
        fontSize: "18px",
        fill: palette.additional["gray"][9]
      }
    },
    secret: {
      maxWidth: "95%",
      overflowWrap: "anywhere"
    },
    field: {
      marginBottom: constants.generalUnit * 4
    }
  })
)

const DashboardModule = () => {
  const classes = useStyles()
  const { gamingApiClient } = useGamingApi()
  const [keys, setKeys] = useState<AccessKey[]>([])
  const [newKey, setNewKey] = useState<AccessKey | undefined>()
  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)
  const debouncedCopiedSecret =
    debounce(() => setCopiedSecret(false), 3000)

  const copySecret = async () => {
    if (newKey?.secret) {
      try {
        await navigator.clipboard.writeText(newKey.secret)
        setCopiedSecret(true)
        debouncedCopiedSecret()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const fetchAccessKeys = useCallback(() => {
    gamingApiClient.listAccessKeys()
      .then(keys => setKeys(keys.filter(key => key.type === "gaming")))
      .catch(console.error)
  }, [gamingApiClient])

  const createGamingAccessKey = useCallback(() => {
    gamingApiClient.createAccessKey({ type: "gaming" })
      .then((key) => {
        setNewKey(key)
        fetchAccessKeys()
        setIsNewKeyModalOpen(true)
      })
      .catch(console.error)
  }, [fetchAccessKeys, gamingApiClient])

  const deleteAccessKey = useCallback((id: string) => {
    gamingApiClient.deleteAccessKey(id)
      .then(fetchAccessKeys)
      .catch(console.error)
  }, [gamingApiClient, fetchAccessKeys])

  useEffect(() => {
    fetchAccessKeys()
  }, [fetchAccessKeys])

  return (
    <>
      <div className={classes.root}>
        <header className={classes.header}>
          <Typography
            variant="h1"
            component="h1"
            data-cy="api-keys-header"
          >
            <Trans>
              Dashboard
            </Trans>
          </Typography>
          <div className={classes.controls}>
            <Button
              data-cy="add-storage-api-key-button"
              onClick={createGamingAccessKey}
              variant="outline"
              size="large"
              disabled={keys.filter(k => k.type === "gaming").length > 0}
            >
              <PlusIcon />
              <span>
                <Trans>Add API Key</Trans>
              </span>
            </Button>
          </div>
        </header>
        <section className={classes.dataArea}>
          {
            keys.map((key: AccessKey, index: number) => (
              <ApiKeyCard
                key={`api-key-${index}`}
                deleteKey={() => deleteAccessKey(key.id)}
                apiKey={key} />))
          }
        </section>
      </div>
      <Modal
        className={classes.modalRoot}
        injectedClass={{
          inner: classes.modalInner
        }}
        active={isNewKeyModalOpen}
        closePosition="none"
        maxWidth="sm"
      >
        <div className={classes.modalContent}>
          <Typography
            variant='h6'
            className={classes.modalHeading}
          >
            <Trans>New Key</Trans>
          </Typography>
          <Typography variant='h4'>
            <Trans>Key ID</Trans>
          </Typography>
          <Typography className={classes.field}>{newKey?.id}</Typography>
          <Typography variant='h4'>
            <Trans>Secret</Trans>
          </Typography>
          <div className={classes.field}>
            <div className={classes.secretContainer}>
              <Typography variant='body2'>
                <Trans>Make sure to save the secret, as it can only be displayed once.</Trans>
              </Typography>
              {copiedSecret && (
                <Typography variant='body2'>
                  <Trans>Copied!</Trans>
                </Typography>
              )}
            </div>
            <div
              className={classes.copyBox}
              onClick={copySecret}
            >
              <Typography
                variant="body1"
                component="p"
                className={classes.secret}
              >
                {newKey?.secret}
              </Typography>
              <CopyIcon className={classes.copyIcon} />
            </div>
          </div>
          <Button
            onClick={() => {
              setIsNewKeyModalOpen(false)
              setNewKey(undefined)
            }}
          >
            <Trans>Close</Trans>
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default DashboardModule
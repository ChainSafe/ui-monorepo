import {
  createStyles,
  debounce,
  makeStyles
} from "@chainsafe/common-theme"
import React, { useState, useEffect } from "react"
import CustomModal from "../../Elements/CustomModal"
import CustomButton from "../../Elements/CustomButton"
import { Trans } from "@lingui/macro"
import { FileFullInfo } from "../../../Contexts/FilesContext"
import {
  Button,
  formatBytes,
  Grid,
  Loading,
  Typography
} from "@chainsafe/common-components"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"
import dayjs from "dayjs"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography, zIndex, animation }: CSFTheme) => {
    return createStyles({
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {}
      },
      modalInner: {
        backgroundColor: constants.fileInfoModal.background,
        color: constants.fileInfoModal.color,
        [breakpoints.down("md")]: {
          bottom:
            Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`
        }
      },
      closeButton: {
        flex: 1,
        marginLeft: constants.generalUnit * 2,
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight,
          margin: 0
        }
      },
      title: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        [breakpoints.down("md")]: {
          textAlign: "center"
        }
      },
      heading: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        [breakpoints.down("md")]: {
          textAlign: "center"
        }
      },
      infoHeading: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left"
      },
      infoContainer: {
        borderTop: constants.fileInfoModal.infoContainerBorderTop,
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 3
        }px`
      },
      infoBox: {
        paddingLeft: constants.generalUnit
      },
      subInfoBox: {
        padding: `${constants.generalUnit * 1}px 0`
      },
      subSubtitle: {
        color: palette.additional["gray"][8]
      },
      technicalContainer: {
        paddingTop: constants.generalUnit,
        paddingBottom: constants.generalUnit
      },
      paddedContainer: {
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 4
        }px`,
        borderBottom: `1px solid ${palette.additional["gray"][3]}`
      },
      loadingContainer: {
        margin: constants.generalUnit * 2
      },
      buttonsContainer: {
        display: "flex",
        padding: `0 ${constants.generalUnit * 4}px ${constants.generalUnit * 4}px`
      },
      copiedFlag: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        left: "50%",
        bottom: "calc(100% + 5px)",
        position: "absolute",
        transform: "translate(-50%, 0%)",
        zIndex: zIndex?.layer1,
        transitionDuration: `${animation.transform}ms`,
        opacity: 0,
        visibility: "hidden",
        backgroundColor: palette.additional["gray"][9],
        color: palette.additional["gray"][1],
        padding: `${constants.generalUnit / 2}px ${constants.generalUnit}px`,
        borderRadius: 2,
        "&:after": {
          transitionDuration: `${animation.transform}ms`,
          content: "''",
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translate(-50%,0)",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `5px solid ${ palette.additional["gray"][9]}`
        },
        "&.active": {
          opacity: 1,
          visibility: "visible"
        }
      },
      copyButton: {
        width: "100%"
      },
      copyContainer: {
        position: "relative",
        flexBasis: "75%",
        color: palette.additional["gray"][9],
        [breakpoints.down("md")]: {
          flexBasis: "100%",
          margin: `${constants.generalUnit * 2}px`
        }
      }
    })
  }
)

interface IFileInfoModuleProps {
  fileInfoPath: string
  close: () => void
}

const FileInfoModal = ({ fileInfoPath, close }: IFileInfoModuleProps) => {
  const classes = useStyles()
  const { filesApiClient } = useFilesApi()
  const [loadingFileInfo, setLoadingInfo] = useState(false)
  const [fullFileInfo, setFullFullInfo] = useState<FileFullInfo | undefined>()
  const { bucket } = useFileBrowser()

  useEffect(() => {

    if (!bucket) return

    setLoadingInfo(true)
    filesApiClient.getBucketObjectInfo(bucket.id, { path: fileInfoPath })
      .then((fullFileResponse) => {
        setFullFullInfo(fullFileResponse)
        setLoadingInfo(false)
      })
      .catch(console.error)
      .finally(() => setLoadingInfo(false))
  }
  , [bucket, fileInfoPath, filesApiClient])

  const [copied, setCopied] = useState(false)
  const debouncedSwitchCopied = debounce(() => setCopied(false), 3000)

  const onCopyCID = () => {
    if (fullFileInfo?.content?.cid) {
      navigator.clipboard.writeText(fullFileInfo?.content?.cid)
        .then(() => {
          setCopied(true)
          debouncedSwitchCopied()
        }).catch(console.error)
    }
  }

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner
      }}
      active={true}
      closePosition="none"
      maxWidth="sm"
    >
      <Grid
        item
        xs={12}
        sm={12}
        className={classes.paddedContainer}
      >
        <Typography
          className={classes.title}
          variant="h5"
          component="h5"
        >
          <Trans>File Info</Trans>
        </Typography>
      </Grid>
      { loadingFileInfo && (
        <Grid
          item
          flexDirection="row"
          justifyContent="center"
        >
          <div className={classes.loadingContainer}>
            <Loading
              size={32}
              type="inherit"
            />
          </div>
        </Grid>
      )}
      {fullFileInfo && !loadingFileInfo && (
        <>
          <Grid
            item
            xs={12}
            sm={12}
            className={classes.infoContainer}
          >
            <div className={classes.infoBox}>
              <div>
                <Typography
                  className={classes.infoHeading}
                  variant="h5"
                  component="h5"
                >
                  <Trans>General</Trans>
                </Typography>
                {fullFileInfo.content?.name && (
                  <div className={classes.subInfoBox}>
                    <Typography
                      variant="body1"
                      component="p"
                    >
                      <Trans>Name</Trans>
                    </Typography>
                    <Typography
                      className={classes.subSubtitle}
                      variant="body2"
                      component="p"
                    >
                      {fullFileInfo.content.name}
                    </Typography>
                  </div>
                )}
                {fullFileInfo.content?.created_at && (
                  <div className={classes.subInfoBox}>
                    <Typography
                      variant="body1"
                      component="p"
                    >
                      <Trans>Date uploaded</Trans>
                    </Typography>
                    <Typography
                      className={classes.subSubtitle}
                      variant="body2"
                      component="p"
                    >
                      {fullFileInfo.content.created_at && dayjs.unix(fullFileInfo.content.created_at).format("DD MMM YYYY h:mm a")}
                    </Typography>
                  </div>
                )}
                {fullFileInfo.content?.size !== undefined && (
                  <div className={classes.subInfoBox}>
                    <Typography
                      variant="body1"
                      component="p"
                    >
                      <Trans>File size</Trans>
                    </Typography>
                    <Typography
                      className={classes.subSubtitle}
                      variant="body2"
                      component="p"
                    >
                      {formatBytes(fullFileInfo.content?.size)}
                    </Typography>
                  </div>
                )}
              </div>
              <div className={classes.technicalContainer}>
                <Typography
                  className={classes.infoHeading}
                  variant="h5"
                  component="h5"
                >
                  <Trans>Technical</Trans>
                </Typography>
                {fullFileInfo.persistent?.stored_cid !== undefined && (
                  <div className={classes.subInfoBox}>
                    <Typography
                      variant="body1"
                      component="p"
                    >
                      <Trans>Stored by miner</Trans>
                    </Typography>
                    <Typography
                      className={classes.subSubtitle}
                      variant="body2"
                      component="p"
                    >
                      {fullFileInfo.persistent?.stored_cid}
                    </Typography>
                  </div>
                )}
                {fullFileInfo.persistent?.stored_cid !== undefined && (
                  <div className={classes.subInfoBox}>
                    <Typography
                      variant="body1"
                      component="p"
                    >
                      <Trans>Number of copies (Replication Factor)</Trans>
                    </Typography>
                    <Typography
                      className={classes.subSubtitle}
                      variant="body2"
                      component="p"
                    >
                      {fullFileInfo.persistent?.stored_cid}
                    </Typography>
                  </div>
                )}
                <div className={classes.subInfoBox}>
                  <Grid
                    item
                    flexDirection="row"
                  >
                    <Typography
                      variant="body1"
                      component="p"
                    >
                      <Trans>CID (Content Identifier)</Trans>
                    </Typography>
                  </Grid>
                  <Typography
                    className={classes.subSubtitle}
                    variant="body2"
                    component="p"
                  >
                    {fullFileInfo.content?.cid}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid
            item
            flexDirection="row"
            className={classes.buttonsContainer}
          >
            <div className={classes.copyContainer}>
              <Button
                type="submit"
                size="large"
                variant="primary"
                className={classes.copyButton}
                onClick={onCopyCID}
              >
                <Trans>Copy CID</Trans>
              </Button>
              <div className={clsx(classes.copiedFlag, { "active": copied })}>
                <span>
                  <Trans>
                      Copied!
                  </Trans>
                </span>
              </div>
            </div>
            <CustomButton
              onClick={() => close()}
              size="large"
              className={classes.closeButton}
              variant="outline"
              type="button"
            >
              <Trans>Close</Trans>
            </CustomButton>
          </Grid>
        </>
      )}
    </CustomModal>
  )
}

export default FileInfoModal

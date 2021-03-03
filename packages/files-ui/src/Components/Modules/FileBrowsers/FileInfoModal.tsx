import {
  createStyles,
  debounce,
  makeStyles,
  useThemeSwitcher,
} from "@chainsafe/common-theme"
import React, { useState, useEffect, useCallback } from "react"
import CustomModal from "../../Elements/CustomModal"
import CustomButton from "../../Elements/CustomButton"
import { Trans } from "@lingui/macro"
import { useDrive, FileFullInfo } from "../../../Contexts/DriveContext"
import {
  Button,
  formatBytes,
  Grid,
  Loading,
  Typography,
} from "@chainsafe/common-components"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography, zIndex }: CSFTheme) => {
    return createStyles({
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {},
      },
      modalInner: {
        backgroundColor: constants.fileInfoModal.background,
        color: constants.fileInfoModal.color,
        [breakpoints.down("md")]: {
          bottom:
            Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`,
        },
      },
      copyButton: {
        backgroundColor: constants.fileInfoModal.copyButtonBackground,
        color: constants.fileInfoModal.color,
        flex: 1,
        [breakpoints.down("md")]: {
          margin: `${constants.generalUnit * 2}px`,
        },
      },
      closeButton: {
        flex: 1,
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight,
        },
      },
      title: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        fontSize: 14,
        [breakpoints.down("md")]: {
          textAlign: "center",
        },
      },
      heading: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        [breakpoints.down("md")]: {
          textAlign: "center",
        },
      },
      infoHeading: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
      },
      infoContainer: {
        borderTop: constants.fileInfoModal.infoContainerBorderTop,
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 3
        }px`,
      },
      infoBox: {
        paddingLeft: constants.generalUnit,
      },
      subInfoBox: {
        padding: `${constants.generalUnit * 1}px 0`,
      },
      subSubtitle: {
        color: palette.additional["gray"][8],
      },
      technicalContainer: {
        paddingTop: constants.generalUnit,
        paddingBottom: constants.generalUnit,
      },
      paddedContainer: {
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 3
        }px`,
      },
      copiedContainer: {
        color: palette.additional["gray"][9],
        paddingLeft: constants.generalUnit,
      },
      loadingContainer: {
        margin: constants.generalUnit * 2,
      },
    })
  },
)

interface IFileInfoModuleProps {
  fileInfoPath: string | undefined
  close: () => void
}

const FileInfoModal: React.FC<IFileInfoModuleProps> = ({
  fileInfoPath,
  close,
}: IFileInfoModuleProps) => {
  const { themeKey } = useThemeSwitcher()
  const classes = useStyles()

  const { getFileInfo } = useDrive()
  const [loadingFileInfo, setLoadingInfo] = useState(false)
  const [fullFileInfo, setFullFullInfo] = useState<FileFullInfo | undefined>(
    undefined,
  )

  useEffect(() => {
    const getFullFileInfo = async () => {
      if (fileInfoPath) {
        try {
          setLoadingInfo(true)
          const fullFileResponse = await getFileInfo(fileInfoPath)
          setFullFullInfo(fullFileResponse)
          setLoadingInfo(false)
        } catch {
          setLoadingInfo(false)
        }
      }
    }
    getFullFileInfo()
    // eslint-disable-next-line
  }, [fileInfoPath])

  const [copied, setCopied] = useState(false)

  const debouncedSwitchCopied = useCallback(
    debounce(() => setCopied(false), 3000),
    [],
  )

  const onCopyCID = async () => {
    if (fullFileInfo?.content?.cid) {
      try {
        await navigator.clipboard.writeText(fullFileInfo?.content?.cid)
        setCopied(true)
        debouncedSwitchCopied()
      } catch (err) {}
    }
  }

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner,
      }}
      active={fileInfoPath ? true : false}
      closePosition="none"
      maxWidth="sm"
    >
      <Grid item xs={12} sm={12} className={classes.paddedContainer}>
        <Typography className={classes.title} variant="h5" component="h5">
          <Trans>File Info</Trans>
        </Typography>
      </Grid>
      {fullFileInfo && !loadingFileInfo ? (
        <>
          <Grid item xs={12} sm={12} className={classes.infoContainer}>
            <div className={classes.infoBox}>
              <div>
                <Typography
                  className={classes.infoHeading}
                  variant="h5"
                  component="h5"
                >
                  <Trans>General</Trans>
                </Typography>
                {fullFileInfo.persistent?.uploaded ? (
                  <div className={classes.subInfoBox}>
                    <Typography variant="body1" component="p">
                      <Trans>Date uploaded</Trans>
                    </Typography>
                    <Typography
                      className={classes.subSubtitle}
                      variant="body2"
                      component="p"
                    >
                      {fullFileInfo.persistent?.uploaded}
                    </Typography>
                  </div>
                ) : null}
                {fullFileInfo.content?.size !== undefined ? (
                  <div className={classes.subInfoBox}>
                    <Typography variant="body1" component="p">
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
                ) : null}
              </div>
              <div className={classes.technicalContainer}>
                <Typography
                  className={classes.infoHeading}
                  variant="h5"
                  component="h5"
                >
                  <Trans>Technical</Trans>
                </Typography>
                {fullFileInfo.persistent?.stored_cid !== undefined ? (
                  <div className={classes.subInfoBox}>
                    <Typography variant="body1" component="p">
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
                ) : null}
                {fullFileInfo.persistent?.stored_cid !== undefined ? (
                  <div className={classes.subInfoBox}>
                    <Typography variant="body1" component="p">
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
                ) : null}
                <div className={classes.subInfoBox}>
                  <Grid item flexDirection="row">
                    <Typography variant="body1" component="p">
                      <Trans>CID (Content Identifier)</Trans>
                    </Typography>
                    {copied ? (
                      <Typography
                        variant="body2"
                        component="p"
                        className={clsx(
                          classes.subSubtitle,
                          classes.copiedContainer,
                        )}
                      >
                        <Trans>copied !</Trans>
                      </Typography>
                    ) : null}
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
          <Grid item flexDirection="row" justifyContent="flex-end">
            <Button
              type="submit"
              size="large"
              className={classes.copyButton}
              onClick={onCopyCID}
            >
              <Trans>Copy CID</Trans>
            </Button>
            <CustomButton
              onClick={() => close()}
              size="large"
              className={classes.closeButton}
              variant={themeKey === "dark" ? "outline" : "dashed"}
              type="button"
            >
              <Trans>Close</Trans>
            </CustomButton>
          </Grid>
        </>
      ) : (
        <Grid item flexDirection="row" justifyContent="center">
          <div className={classes.loadingContainer}>
            <Loading size={32} type="inherit" />
          </div>
        </Grid>
      )}
    </CustomModal>
  )
}

export default FileInfoModal

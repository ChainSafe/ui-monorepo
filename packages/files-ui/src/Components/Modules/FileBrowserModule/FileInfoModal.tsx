import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
} from "@chainsafe/common-theme"
import React, { useState, useEffect, useCallback } from "react"
import CustomModal from "../../Elements/CustomModal"
import CustomButton from "../../Elements/CustomButton"
import { Trans } from "@lingui/macro"
import { useDrive, FileFullInfo } from "../../../Contexts/DriveContext"
import { Grid, Typography } from "@chainsafe/common-components"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography, zIndex }: ITheme) => {
    return createStyles({
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {},
      },
      modalInner: {
        [breakpoints.down("md")]: {
          bottom:
            (constants?.mobileButtonHeight as number) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`,
        },
      },
      okButton: {
        marginLeft: constants.generalUnit,
        color: palette.common.white.main,
        backgroundColor: palette.common.black.main,
      },
      cancelButton: {
        [breakpoints.down("md")]: {
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: constants?.mobileButtonHeight,
        },
      },
      heading: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        [breakpoints.down("md")]: {
          textAlign: "center",
        },
      },
      infoContainer: {
        borderTop: `1px solid ${palette.additional["gray"][5]}`,
        borderBottom: `1px solid ${palette.additional["gray"][5]}`,
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 3
        }px`,
      },
      paddedContainer: {
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 3
        }px`,
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
  }, [fileInfoPath])

  const desktop = useMediaQuery("md")

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
        <Typography className={classes.heading} variant="h5" component="h5">
          <Trans>File Info</Trans>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} className={classes.infoContainer}>
        {fullFileInfo && !loadingFileInfo ? (
          <div>{fullFileInfo.content?.name}</div>
        ) : null}
      </Grid>
      <Grid
        item
        flexDirection="row"
        justifyContent="flex-end"
        className={classes.paddedContainer}
      >
        <CustomButton
          onClick={() => close()}
          size="medium"
          className={classes.cancelButton}
          variant={desktop ? "outline" : "gray"}
          type="button"
        >
          <Trans>Close</Trans>
        </CustomButton>
      </Grid>
    </CustomModal>
  )
}

export default FileInfoModal

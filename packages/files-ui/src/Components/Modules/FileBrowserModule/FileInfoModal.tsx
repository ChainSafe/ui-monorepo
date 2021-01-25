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
import {
  IFile,
  useDrive,
  DirectoryContentResponse,
} from "../../../Contexts/DriveContext"
import {
  Button,
  FolderIcon,
  Grid,
  ITreeNodeProps,
  ScrollbarWrapper,
  TreeView,
  Typography,
} from "@chainsafe/common-components"
import { getPathWithFile } from "../../../Utils/pathUtils"

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
      treeContainer: {
        padding: `${constants.generalUnit * 4}px 0`,
        borderTop: `1px solid ${palette.additional["gray"][5]}`,
        borderBottom: `1px solid ${palette.additional["gray"][5]}`,
      },
      treeScrollView: {
        paddingLeft: constants.generalUnit * 4,
      },
      paddedContainer: {
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 3
        }px`,
      },
    })
  },
)

interface IMoveFileModuleProps {
  currentPath: string
  file?: IFile
  modalOpen: boolean
  close: () => void
}

const FileInfoModal: React.FC<IMoveFileModuleProps> = ({
  currentPath,
  file,
  modalOpen,
  close,
}: IMoveFileModuleProps) => {
  const classes = useStyles()
  const {} = useDrive()
  const [loadingFileInfo, setLoadingInfo] = useState(false)

  useEffect(() => {
    if (modalOpen) {
      setLoadingInfo(true)
      //
      setLoadingInfo(false)
    }
  }, [modalOpen])

  const desktop = useMediaQuery("md")

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{
        inner: classes.modalInner,
      }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
    >
      <Grid item xs={12} sm={12} className={classes.paddedContainer}>
        <Typography className={classes.heading} variant="h5" component="h5">
          <Trans>File</Trans>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} className={classes.treeContainer}>
        File info
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
          <Trans>Ok</Trans>
        </CustomButton>
      </Grid>
    </CustomModal>
  )
}

export default FileInfoModal

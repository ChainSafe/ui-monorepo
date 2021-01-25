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

const MoveFileModule: React.FC<IMoveFileModuleProps> = ({
  currentPath,
  file,
  modalOpen,
  close,
}: IMoveFileModuleProps) => {
  const classes = useStyles()
  const { moveFile, getFolderTree } = useDrive()
  const [movingFile, setMovingFile] = useState(false)
  const [movePath, setMovePath] = useState<undefined | string>(undefined)
  const [folderTree, setFolderTree] = useState<ITreeNodeProps[]>([])

  const mapFolderTree = useCallback(
    (folderTreeEntries: DirectoryContentResponse[]): ITreeNodeProps[] => {
      return folderTreeEntries.map((entry) => ({
        id: entry.path,
        title: entry.name,
        expandable: true,
        tree: entry.entries ? mapFolderTree(entry.entries) : [],
      }))
    },
    [],
  )

  const getFolderTreeData = useCallback(async () => {
    try {
      const newFolderTree = await getFolderTree()
      if (newFolderTree.entries) {
        const folderTreeNodes = [
          {
            id: "/",
            title: "Home",
            isExpanded: true,
            expandable: true,
            tree: mapFolderTree(newFolderTree.entries),
          },
        ]
        setFolderTree(folderTreeNodes)
      }
    } catch {
      //
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    getFolderTreeData()
  }, [getFolderTreeData])

  useEffect(() => {
    if (modalOpen) {
      getFolderTreeData()
    }
  }, [modalOpen, getFolderTreeData])

  const onMoveFile = async () => {
    if (file && movePath) {
      try {
        setMovingFile(true)
        await moveFile({
          path: `${currentPath}${file.name}`,
          new_path: getPathWithFile(movePath, file.name),
        })
        setMovingFile(false)
        close()
      } catch {
        setMovingFile(false)
      }
    }
  }

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
          <Trans>Move to...</Trans>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} className={classes.treeContainer}>
        <ScrollbarWrapper autoHide={true} maxHeight={200}>
          <div className={classes.treeScrollView}>
            <TreeView
              treeData={folderTree}
              commonIcon={<FolderIcon />}
              selectedId={movePath}
              onSelectNode={(path: string) => setMovePath(path)}
            />
          </div>
        </ScrollbarWrapper>
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
          <Trans>Cancel</Trans>
        </CustomButton>
        <Button
          size={desktop ? "medium" : "large"}
          type="submit"
          className={classes.okButton}
          loading={movingFile}
          disabled={!movePath}
          onClick={onMoveFile}
        >
          <Trans>Move</Trans>
        </Button>
      </Grid>
    </CustomModal>
  )
}

export default MoveFileModule

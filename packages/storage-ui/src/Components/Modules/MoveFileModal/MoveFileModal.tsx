import { createStyles, makeStyles, useMediaQuery } from "@chainsafe/common-theme"
import React, { useState, useEffect, useCallback, useMemo } from "react"
import CustomModal from "../../Elements/CustomModal"
import CustomButton from "../../Elements/CustomButton"
import { t, Trans } from "@lingui/macro"
import { DirectoryContentResponse, FileSystemItem } from "../../../Contexts/StorageContext"
import { Button, FolderIcon, Grid, ITreeNodeProps, ScrollbarWrapper, TreeView, Typography } from "@chainsafe/common-components"
import { CSSTheme } from "../../../Themes/types"
import { useFileBrowser } from "../../../Contexts/FileBrowserContext"
import { useStorageApi } from "../../../Contexts/StorageApiContext"
import { MoveModalMode } from "../../../Contexts/types"
import { getPathWithFile, isSubFolder } from "../../../Utils/pathUtils"


const useStyles = makeStyles(
  ({ breakpoints, constants, palette, typography, zIndex }: CSSTheme) => {
    return createStyles({
      modalRoot: {
        zIndex: zIndex?.blocker,
        [breakpoints.down("md")]: {}
      },
      modalInner: {
        backgroundColor: constants.moveFileModal.background,
        color: constants.moveFileModal.color,
        [breakpoints.down("md")]: {
          bottom:
            Number(constants?.mobileButtonHeight) + constants.generalUnit,
          borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
          borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
          maxWidth: `${breakpoints.width("md")}px !important`
        }
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
        fontWeight: typography.fontWeight.semibold,
        textAlign: "left",
        [breakpoints.down("md")]: {
          textAlign: "center"
        }
      },
      treeContainer: {
        padding: `${constants.generalUnit * 4}px 0`,
        borderTop: `1px solid ${palette.additional["gray"][5]}`,
        borderBottom: `1px solid ${palette.additional["gray"][5]}`
      },
      treeScrollView: {
        paddingLeft: constants.generalUnit * 4
      },
      paddedContainer: {
        padding: `${constants.generalUnit * 2}px ${
          constants.generalUnit * 3
        }px`
      }
    })
  }
)

interface IMoveFileModuleProps {
  filesToMove: FileSystemItem[]
  modalOpen: boolean
  onClose: () => void
  onCancel: () => void
  mode?: MoveModalMode
}

const MoveFileModal = ({ filesToMove, modalOpen, onClose, onCancel, mode }: IMoveFileModuleProps) => {
  const classes = useStyles()
  const { storageApiClient } = useStorageApi()
  const { moveItems, recoverItems, bucket, currentPath } = useFileBrowser()
  const [isMovingFile, setIsMovingFile] = useState(false)
  const [movePath, setMovePath] = useState<undefined | string>(undefined)
  const [folderTree, setFolderTree] = useState<ITreeNodeProps[]>([])

  const mapFolderTree = useCallback(
    (folderTreeEntries: DirectoryContentResponse[]): ITreeNodeProps[] => {
      return folderTreeEntries.map((entry) => ({
        id: entry.path,
        title: entry.name,
        expandable: true,
        tree: entry.entries ? mapFolderTree(entry.entries) : []
      }))
    },
    []
  )

  const getFolderTreeData = useCallback(async () => {
    if (!bucket) return
    storageApiClient.getBucketDirectoriesTree(bucket.id).then((newFolderTree) => {
      if (newFolderTree.entries) {
        const folderTreeNodes = [
          {
            id: "/",
            title: "Home",
            isExpanded: true,
            expandable: true,
            tree: mapFolderTree(newFolderTree.entries)
          }
        ]
        setFolderTree(folderTreeNodes)
      } else {
        setFolderTree([])
      }
    }).catch(console.error)
  }, [storageApiClient, mapFolderTree, bucket])

  useEffect(() => {
    if (modalOpen) {
      getFolderTreeData()
    } else {
      setMovePath(undefined)
    }
  }, [modalOpen, getFolderTreeData])

  const onMoveFile = () => {
    const moveFn = mode === "move" ? moveItems : recoverItems
    if (!movePath || !moveFn) return

    setMovingFile(true)
    moveFn(filesToMove.map(f => ({
      cid: f.cid,
      name: f.name
    })), movePath)
      .then(onClose)
      .catch(console.error)
      .finally(() => setIsMovingFile(false))
  }

  const desktop = useMediaQuery("md")

  const folders = useMemo(() =>
    filesToMove.filter((f) => f.isFolder)
  , [filesToMove])

  const isSubFolderOfAnySelectedFolder = useMemo(() => {
    if(!movePath){
      return false
    }

    return folders.some((folder) => {
      const currentPathWithFolder = getPathWithFile(currentPath, folder.name)

      return movePath === currentPathWithFolder || // don't allow a move from a folder in itself
      isSubFolder(movePath, currentPathWithFolder)
    })
  }, [currentPath, folders, movePath])

  const isAllowedToMove = useMemo(() =>
    !!movePath && // the move path should be set
    mode === "move" && // we're moving and not recovering
    movePath !== currentPath && // can't be the same parent
    (!folders.length || !isSubFolderOfAnySelectedFolder) // if it has folders and the move isn't into one of them
  , [movePath, mode, currentPath, folders.length, isSubFolderOfAnySelectedFolder])

  return (
    <CustomModal
      className={classes.modalRoot}
      injectedClass={{ inner: classes.modalInner }}
      active={modalOpen}
      closePosition="none"
      maxWidth="sm"
      onModalBodyClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        className={classes.paddedContainer}
      >
        <Typography className={classes.heading}
          variant="h5"
          component="h5">
          <Trans>Move to...</Trans>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        className={classes.treeContainer}
      >
        <ScrollbarWrapper
          autoHide={true}
          maxHeight={200}
        >
          <div
            className={classes.treeScrollView}
          >
            {folderTree.length
              ? <TreeView
                treeData={folderTree}
                commonIcon={<FolderIcon />}
                selectedId={movePath}
                onSelectNode={(path: string) => setMovePath(path)}
              />
              : <Typography><Trans>No folders</Trans></Typography>
            }
          </div>
        </ScrollbarWrapper>
      </Grid>
      <Grid
        item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        className={classes.paddedContainer}
      >
        {!!movePath && !isAllowedToMove && (
          <Typography
            component="p"
            variant="body1"
          >
            {
              folders.length
                ? t`You can't move folders to this path`
                : t`The files are already in this folder`
            }
          </Typography>
        )}
        <Grid
          item
          flexDirection="row"
          justifyContent="flex-end"
        >
          <CustomButton
            onClick={onCancel}
            size="medium"
            className={classes.cancelButton}
            variant={desktop ? "outline" : "gray"}
            type="button"
          >
            <Trans>Cancel</Trans>
          </CustomButton>
          <Button
            variant="primary"
            size={desktop ? "medium" : "large"}
            type="submit"
            className={classes.okButton}
            loading={isMovingFile}
            disabled={!isAllowedToMove}
            onClick={onMoveFile}
          >
            {mode === "move" ? t`Move` : t`Recover`}
          </Button>
        </Grid>
      </Grid>
    </CustomModal>
  )
}

export default MoveFileModal

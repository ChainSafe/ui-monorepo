import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
} from "@chainsafe/common-theme"
import React, { useState, useEffect } from "react"
import CustomModal from "../../Elements/CustomModal"
import CustomButton from "../../Elements/CustomButton"
import { Trans } from "@lingui/macro"
import { IFile, useDrive } from "../../../Contexts/DriveContext"
import {
  Button,
  FolderIcon,
  Grid,
  ITreeNodeData,
  TreeView,
  Typography,
} from "@chainsafe/common-components"

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
        padding: `0 ${constants.generalUnit * 4}px`,
        maxHeight: "200px",
        overflow: "scroll",
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

const treeArrData: ITreeNodeData[] = [
  {
    title: "Bob",
    expandable: true,
    id: "1",
    tree: [
      {
        title: "Mary",
        id: "2",
        expandable: true,
        tree: [{ title: "Suzy", id: "3" }],
      },
      {
        title: "Phil",
        id: "4",
        expandable: true,
        tree: [
          { title: "Jon", id: "5" },
          { title: "Paul", id: "6" },
        ],
      },
    ],
  },
  {
    title: "Bob",
    expandable: true,
    id: "7",
    icon: <FolderIcon />,
    tree: [
      {
        title: "Mary",
        id: "8",
        expandable: true,
        tree: [{ title: "Suzy", id: "9", icon: <FolderIcon /> }],
      },
      {
        title: "Phil",
        id: "6",
        expandable: true,
        tree: [
          { title: "Jon", id: "10" },
          { title: "Paul", id: "11" },
        ],
      },
    ],
  },
]

const CreateFolderModule: React.FC<IMoveFileModuleProps> = ({
  currentPath,
  file,
  modalOpen,
  close,
}: IMoveFileModuleProps) => {
  const classes = useStyles()
  const { moveFile, getFolderTree } = useDrive()
  const [movingFile, setMovingFile] = useState(false)
  const [movePath, setMovePath] = useState<undefined | string>(undefined)
  const [folderTree, setFolderTree] = useState<ITreeNodeData[]>(treeArrData)

  const mapFolderTree = (folderTree: any) => {
    // map code should be here
    return folderTree
  }

  useEffect(() => {
    const getFolderTreeData = async () => {
      const newFolderTree = await getFolderTree("/")
      setFolderTree(mapFolderTree(newFolderTree))
    }
    getFolderTreeData()
  }, [])

  const onMoveFile = async () => {
    if (file && movePath) {
      try {
        setMovingFile(true)
        await moveFile({
          path: `${currentPath}${file.name}`,
          new_path: `${movePath}${file.name}`,
        })
        setMovingFile(false)
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
        <div className={classes.treeScrollView}>
          <TreeView
            treeData={folderTree}
            commonIcon={<FolderIcon />}
            selectedId={movePath}
            onSelectNode={(path: string) => setMovePath(path)}
          />
        </div>
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
        >
          <Trans>Move</Trans>
        </Button>
      </Grid>
    </CustomModal>
  )
}

export default CreateFolderModule

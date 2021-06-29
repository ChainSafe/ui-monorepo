import React, { useCallback, useState } from "react"
import { DeleteSvg, EditSvg, IMenuItem } from "@chainsafe/common-components"
import { makeStyles, createStyles, useDoubleClick, useThemeSwitcher } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { CSFTheme } from "../../../Themes/types"
import { Bucket } from "@chainsafe/files-api-client"
import SharedFolderRow from "./views/FileSystemItem/SharedFolderRow"

const useStyles = makeStyles(({ breakpoints, constants }: CSFTheme) => {
  return createStyles({
    renameInput: {
      width: "100%",
      [breakpoints.up("md")]: {
        margin: 0
      },
      [breakpoints.down("md")]: {
        margin: `${constants.generalUnit * 4.2}px 0`
      }
    },
    modalRoot: {
      [breakpoints.down("md")]: {}
    },
    modalInner: {
      [breakpoints.down("md")]: {
        bottom:
          Number(constants?.mobileButtonHeight) + constants.generalUnit,
        borderTopLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderTopRightRadius: `${constants.generalUnit * 1.5}px`,
        borderBottomLeftRadius: `${constants.generalUnit * 1.5}px`,
        borderBottomRightRadius: `${constants.generalUnit * 1.5}px`,
        maxWidth: `${breakpoints.width("md")}px !important`
      }
    },
    renameHeader: {
      textAlign: "center"
    },
    renameFooter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    renameModal: {
      padding: constants.generalUnit * 4
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
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
      "& svg": {
        fill: constants.fileSystemItemRow.menuIcon
      }
    },
    dropdownIcon: {
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon
      }
    }
  })
})

interface Props {
  bucket: Bucket
  handleRename: (bucket: Bucket, newName: string) => void
}

const SharedFolderRowWrapper = ({ bucket, handleRename }: Props) => {
  const { desktop } = useThemeSwitcher()
  const classes = useStyles()
  const [isEditing, setIsEditing] = useState(false)

  const menuItems: IMenuItem[] = [{
    contents: (
      <>
        <EditSvg className={classes.menuIcon} />
        <span data-cy="menu-rename">
          <Trans>Rename</Trans>
        </span>
      </>
    ),
    onClick: () => setIsEditing(true)
  },
  {
    contents: (
      <>
        <DeleteSvg className={classes.menuIcon} />
        <span data-cy="menu-delete">
          <Trans>Delete</Trans>
        </span>
      </>
    ),
    onClick: () => console.log("not implemented")
  }]

  const onSingleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop 
      } else {
        // on mobile
      }
    },
    [desktop]
  )

  const onDoubleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop
      } else {
        // on mobile
        return
      }
    },
    [desktop]
  )

  const { click } = useDoubleClick(onSingleClick, onDoubleClick)

  const onFolderClick = (e?: React.MouseEvent) => {
    e?.persist()
    click(e)
  }

  return (
    <SharedFolderRow
      menuItems={menuItems}
      onFolderClick={onFolderClick}
      bucket={bucket}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      handleRename={handleRename}
    />
  )
}

export default SharedFolderRowWrapper

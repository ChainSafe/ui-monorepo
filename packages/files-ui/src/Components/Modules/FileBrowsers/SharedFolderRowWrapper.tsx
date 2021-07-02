import React, { useCallback, useState } from "react"
import {
  // DeleteSvg,
  EditSvg,
  IMenuItem
} from "@chainsafe/common-components"
import { makeStyles, createStyles, useDoubleClick, useThemeSwitcher } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { CSFTheme } from "../../../Themes/types"
import SharedFolderRow from "./views/FileSystemItem/SharedFolderRow"
import { BucketKeyPermission } from "../../../Contexts/FilesContext"

const useStyles = makeStyles(({ constants }: CSFTheme) => {
  return createStyles({
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
      "& svg": {
        fill: constants.fileSystemItemRow.menuIcon
      }
    }
  })
})

interface Props {
  bucket: BucketKeyPermission
  handleRename: (bucket: BucketKeyPermission, newName: string) => void
  openSharedFolder: (bucketId: string) => void
}

const SharedFolderRowWrapper = ({ bucket, handleRename, openSharedFolder }: Props) => {
  const { desktop } = useThemeSwitcher()
  const classes = useStyles()
  const [isEditing, setIsEditing] = useState(false)

  const menuItems: IMenuItem[] = [
    {
      contents: (
        <>
          <EditSvg className={classes.menuIcon} />
          <span data-cy="menu-rename">
            <Trans>Rename</Trans>
          </span>
        </>
      ),
      onClick: () => setIsEditing(true)
    }
    // {
    //   contents: (
    //     <>
    //       <DeleteSvg className={classes.menuIcon} />
    //       <span data-cy="menu-delete">
    //         <Trans>Delete</Trans>
    //       </span>
    //     </>
    //   ),
    //   onClick: () => console.log("not implemented")
    // }
  ]

  const onSingleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop 
      } else {
        // on mobile
        openSharedFolder(bucket.id)
      }
    },
    [desktop, openSharedFolder, bucket]
  )

  const onDoubleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop
        openSharedFolder(bucket.id)
      } else {
        // on mobile
        return
      }
    },
    [desktop, openSharedFolder, bucket]
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

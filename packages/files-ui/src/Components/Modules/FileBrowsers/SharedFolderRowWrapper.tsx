import React, { useCallback } from "react"
import { DeleteSvg, EditSvg, IMenuItem } from "@chainsafe/common-components"
import { makeStyles, createStyles, useDoubleClick, useThemeSwitcher } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { CSFTheme } from "../../../Themes/types"
import { Bucket } from "@chainsafe/files-api-client"
import SharedFolderItem from "./views/FileSystemItem/SharedFolderRow"

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
  bucket: Bucket
  openShare: (bucketId: string) => void
}

const SharedFolderRowWrapper = ({ bucket, openShare }: Props) => {
  const { desktop } = useThemeSwitcher()
  const classes = useStyles()

  const menuItems: IMenuItem[] = [{
    contents: (
      <>
        <EditSvg className={classes.menuIcon} />
        <span data-cy="menu-rename">
          <Trans>Rename</Trans>
        </span>
      </>
    ),
    onClick: () => console.log("not implemented")
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
        openShare(bucket.id)
      }
    },
    [desktop, openShare, bucket]
  )

  const onDoubleClick = useCallback(
    () => {
      if (desktop) {
        // on desktop
        openShare(bucket.id)
      } else {
        // on mobile
        return
      }
    },
    [desktop, openShare, bucket]
  )

  const { click } = useDoubleClick(onSingleClick, onDoubleClick)

  const onFolderClick = (e?: React.MouseEvent) => {
    e?.persist()
    click(e)
  }

  return (
    <>
      <SharedFolderItem
        menuItems={menuItems}
        onFolderClick={onFolderClick}
        bucket={bucket}
      />
    </>
  )
}

export default SharedFolderRowWrapper

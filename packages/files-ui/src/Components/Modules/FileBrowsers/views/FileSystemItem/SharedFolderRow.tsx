import React from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import {
  FolderFilledIcon,
  formatBytes,
  IMenuItem,
  MenuDropdown,
  MoreIcon,
  TableCell,
  TableRow,
  Typography
} from "@chainsafe/common-components"
import { CSFTheme } from "../../../../../Themes/types"
import { Bucket, BucketUser } from "@chainsafe/files-api-client"
import { desktopSharedGridSettings, mobileSharedGridSettings } from "../../SharedFoldersOverview"
import SharedUsers from "../../../../Elements/SharedUser"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {

  return createStyles({
    tableRow: {
      border: "2px solid transparent",
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopSharedGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileSharedGridSettings
      },
      "&.droppable": {
        border: `2px solid ${palette.primary.main}`
      }
    },
    folderIcon: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        width: constants.generalUnit * 2.5,
        fill: palette.additional.gray[9]
      }
    },
    renameInput: {
      width: "100%",
      [breakpoints.up("md")]: {
        margin: 0
      },
      [breakpoints.down("md")]: {
        margin: `${constants.generalUnit * 4.2}px 0`
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
    desktopRename: {
      display: "flex",
      flexDirection: "row",
      "& svg": {
        width: 20,
        height: 20
      }
    },
    filename: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      "&.editing": {
        overflow: "visible"
      }
    },
    dropdownIcon: {
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon
      }
    },
    dropdownOptions: {
      backgroundColor: constants.fileSystemItemRow.optionsBackground,
      color: constants.fileSystemItemRow.optionsColor,
      border: `1px solid ${constants.fileSystemItemRow.optionsBorder}`
    },
    dropdownItem: {
      backgroundColor: constants.fileSystemItemRow.itemBackground,
      color: constants.fileSystemItemRow.itemColor
    }
  })
})

interface Props {
  bucket: Bucket
  onFolderClick: (e?: React.MouseEvent) => void
  menuItems: IMenuItem[]
}

const SharedFolderRow = ({ bucket, onFolderClick, menuItems }: Props) => {
  const classes = useStyles()
  const { name, size } = bucket
  const { desktop } = useThemeSwitcher()

  const getUserIds = (users: BucketUser[]): string[] => {
    return users.reduce((acc: string[], user): string[] => {
      return user.uuid ? [...acc, user.uuid] :  acc
    }, [] as string[])
  }

  const userIds = [...getUserIds(bucket.owners), ...getUserIds(bucket.readers), ...getUserIds(bucket.writers)]

  return  (
    <TableRow
      data-cy="shared-folder-item-row"
      className={classes.tableRow}
      type="grid"
    >
      <TableCell
        className={classes.folderIcon}
        onClick={(e) => onFolderClick(e)}
      >
        <FolderFilledIcon/>
      </TableCell>
      <TableCell
        data-cy="shared-folder-item-name"
        align="left"
        className={classes.filename}
        onClick={(e) => onFolderClick(e)}
      >
        <Typography>{name}</Typography>
      </TableCell>
      <TableCell
        data-cy="shared-folder-item-shared-with"
        align="left"
        className={classes.filename}
        onClick={(e) => onFolderClick(e)}
      >
        <SharedUsers sharedUsers={userIds}/>
      </TableCell>
      {desktop && (
        <>
          {/* <TableCell align="left">
              {
                dayjs.unix(created_at).format("DD MMM YYYY h:mm a")
              }
            </TableCell> */}
          <TableCell align="left">
            {formatBytes(size)}
          </TableCell>
        </>
      )}
      <TableCell align="right">
        <MenuDropdown
          testId='sharedFolderDropdown'
          animation="none"
          anchor={desktop ? "bottom-center" : "bottom-right"}
          menuItems={menuItems}
          classNames={{
            icon: classes.dropdownIcon,
            options: classes.dropdownOptions,
            item: classes.dropdownItem
          }}
          indicator={MoreIcon}
        />
      </TableCell>
    </TableRow>
  )
}

export default SharedFolderRow

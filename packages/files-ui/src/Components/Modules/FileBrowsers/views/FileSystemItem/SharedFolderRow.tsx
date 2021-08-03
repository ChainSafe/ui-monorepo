import React, { useCallback, useMemo, useState } from "react"
import { makeStyles, createStyles, useThemeSwitcher, useDoubleClick } from "@chainsafe/common-theme"
import {
  CloseCirceSvg,
  DeleteSvg,
  EditSvg,
  FolderFilledIcon,
  formatBytes,
  FormikTextInput,
  IMenuItem,
  MenuDropdown,
  MoreIcon,
  TableCell,
  TableRow,
  Typography,
  UserShareSvg
} from "@chainsafe/common-components"
import { CSFTheme } from "../../../../../Themes/types"
import { LookupUser } from "@chainsafe/files-api-client"
import { desktopSharedGridSettings, mobileSharedGridSettings } from "../../SharedFoldersOverview"
import SharedUsers from "../../../../Elements/SharedUser"
import { t, Trans } from "@lingui/macro"
import { Form, FormikProvider, useFormik } from "formik"
import clsx from "clsx"
import { BucketKeyPermission } from "../../../../../Contexts/FilesContext"
import UserBubble from "../../../../Elements/UserBubble"
import { renameSchema } from "../../../../../Utils/validationSchema"
import { centerEllipsis } from "../../../../../Utils/Helpers"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {

  return createStyles({
    tableRow: {
      border: "2px solid transparent",
      [breakpoints.up("md")]: {
        cursor: "pointer",
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
    sharedUser: {
      overflow: "visible",
      [breakpoints.down("sm")]: {
        padding: "0 !important"
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
  bucket: BucketKeyPermission
  handleRename: (bucket: BucketKeyPermission, newName: string) => void
  openSharedFolder: (bucketId: string) => void
  onEditSharedFolder: () => void
  handleDeleteSharedFolder: () => void
}

const SharedFolderRow = ({ bucket, handleRename, openSharedFolder, handleDeleteSharedFolder, onEditSharedFolder }: Props) => {
  const classes = useStyles()
  const { name, size } = bucket

  const { desktop } = useThemeSwitcher()
  const [isRenaming, setIsRenaming] = useState(false)

  const isOwner = useMemo(() => bucket.permission === "owner", [bucket.permission])

  const menuItems: IMenuItem[] = isOwner
    ? [{
      contents: (
        <>
          <EditSvg className={classes.menuIcon} />
          <span data-cy="menu-rename">
            <Trans>Rename</Trans>
          </span>
        </>
      ),
      onClick: () => setIsRenaming(true)
    },
    {
      contents: (
        <>
          <UserShareSvg className={classes.menuIcon} />
          <span data-cy="menu-manage-access">
            <Trans>Manage Access</Trans>
          </span>
        </>
      ),
      onClick: onEditSharedFolder
    }, {
      contents: (
        <>
          <DeleteSvg className={classes.menuIcon} />
          <span data-cy="menu-delete">
            <Trans>Delete</Trans>
          </span>
        </>
      ),
      onClick: handleDeleteSharedFolder
    }]
    : [{
      contents: (
        <>
          <CloseCirceSvg className={classes.menuIcon} />
          <span data-cy="menu-delete">
            <Trans>Leave</Trans>
          </span>
        </>
      ),
      onClick: handleDeleteSharedFolder
    }]


  const onSingleClick = useCallback(
    () => {
      if (!desktop) {
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
      }
    },
    [desktop, openSharedFolder, bucket]
  )

  const { click } = useDoubleClick(onSingleClick, onDoubleClick)

  const onFolderClick = (e?: React.MouseEvent) => {
    e?.persist()
    click(e)
  }

  const getUserLabels = (users: LookupUser[]): string[] => {
    return users.reduce((acc: string[], user): string[] => {
      if (user.username !== "") {
        return user.username ? [...acc, user.username] :  acc
      }

      if (user.public_address !== "") {
        return user.public_address ? [...acc, centerEllipsis(user.public_address, 4)] :  acc
      }

      return user.uuid ? [...acc, user.uuid] :  acc
    }, [] as string[])
  }

  const userLabels = [...getUserLabels(bucket.owners), ...getUserLabels(bucket.readers), ...getUserLabels(bucket.writers)]

  const formik = useFormik({
    initialValues:{
      fileName: name
    },
    enableReinitialize: true,
    validationSchema: renameSchema,
    onSubmit:(values, { resetForm }) => {
      const newName = values.fileName?.trim()

      newName && handleRename && handleRename(bucket, newName)
      setIsRenaming(false)
      resetForm()
    }
  })

  const stopEditing = useCallback(() => {
    setIsRenaming(false)
    formik.resetForm()
  }, [formik, setIsRenaming])

  return  (
    <TableRow
      data-cy="shared-folder-item-row"
      className={classes.tableRow}
      type="grid"
    >
      {desktop &&
        <TableCell
          className={classes.folderIcon}
          onClick={(e) => onFolderClick(e)}
        >
          <FolderFilledIcon/>
        </TableCell>
      }
      <TableCell
        data-cy="shared-folder-item-name"
        align="left"
        className={clsx(classes.filename, desktop && isRenaming && "editing")}
        onClick={(e) => onFolderClick(e)}
      >
        {!isRenaming
          ? <Typography>{name}</Typography>
          : <FormikProvider value={formik}>
            <Form
              className={classes.desktopRename}
              data-cy='rename-form'
              onBlur={stopEditing}
            >
              <FormikTextInput
                className={classes.renameInput}
                name="fileName"
                inputVariant="minimal"
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    stopEditing()
                  }
                }}
                placeholder = {t`Please enter a folder name`}
                autoFocus={isRenaming}
              />
            </Form>
          </FormikProvider>
        }
      </TableCell>
      {desktop &&
        <TableCell align="left">
          {isOwner
            ? t`me`
            : <UserBubble tooltip={bucket.owners[0].uuid || ""} />}
        </TableCell>
      }
      <TableCell
        data-cy="shared-folder-item-shared-with"
        align="left"
        className={classes.sharedUser}
      >
        <SharedUsers sharedUsers={userLabels}/>
      </TableCell>
      {desktop &&
        <TableCell align="left">
          {formatBytes(size)}
        </TableCell>
      }
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

import React from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { t } from "@lingui/macro"
import clsx from "clsx"
import {
  Button,
  CheckboxInput,
  CheckSvg,
  formatBytes,
  FormikTextInput,
  IMenuItem,
  MenuDropdown,
  MoreIcon,
  TableCell,
  TableRow,
  Typography
} from "@chainsafe/common-components"
import { CSFTheme } from "../../../../../Themes/types"
import dayjs from "dayjs"
import { FileSystemItem } from "../../../../../Contexts/DriveContext"
import { ConnectDragPreview } from "react-dnd"
import { Form, Formik } from "formik"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {
  const desktopGridSettings = "50px 69px 3fr 190px 100px 45px !important"
  const mobileGridSettings = "69px 3fr 45px !important"

  return createStyles({
    tableRow: {
      border: "2px solid transparent",
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileGridSettings
      },
      "&.droppable": {
        border: `2px solid ${palette.primary.main}`
      }
    },
    fileIcon: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        width: constants.generalUnit * 2.5,
        fill: constants.fileSystemItemRow.icon
      }
    },
    folderIcon: {
      "& svg": {
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

interface IFileSystemTableItemProps {
  isFolder: boolean
  isOverMove: boolean
  isOverUpload: boolean
  selected: string[]
  file: FileSystemItem
  editing: string | undefined
  handleAddToSelectedCids: (selected: string) => void
  onFolderOrFileClicks: (e?: React.MouseEvent) => void
  icon: React.ReactNode
  preview: ConnectDragPreview
  renameSchema: any
  setEditing: (editing: string |  undefined) => void
  handleRename?: (path: string, newPath: string) => Promise<void>
  currentPath: string | undefined
  menuItems: IMenuItem[]
}

const FileSystemTableItem = React.forwardRef(
  ({
    isFolder,
    isOverMove,
    isOverUpload,
    selected,
    file,
    editing,
    handleAddToSelectedCids,
    onFolderOrFileClicks,
    icon,
    preview,
    renameSchema,
    setEditing,
    handleRename,
    currentPath,
    menuItems
  }: IFileSystemTableItemProps, forwardedRef: any) => {
    const classes = useStyles()
    const { name, cid, created_at, size } = file
    const { desktop } = useThemeSwitcher()

    return  (
      <TableRow
        data-cy="file-item-row"
        className={clsx(classes.tableRow, {
          droppable: isFolder && (isOverMove || isOverUpload)
        })}
        type="grid"
        rowSelectable={true}
        ref={forwardedRef}
        selected={selected.includes(cid)}
      >
        {desktop && (
          <TableCell>
            <CheckboxInput
              value={selected.includes(cid)}
              onChange={() => handleAddToSelectedCids(cid)}
            />
          </TableCell>
        )}
        <TableCell
          className={clsx(classes.fileIcon, isFolder && classes.folderIcon)}
          onClick={(e) => onFolderOrFileClicks(e)}
        >
          {icon}
        </TableCell>
        <TableCell
          ref={preview}
          align="left"
          className={clsx(classes.filename, desktop && editing === cid && "editing")}
          onClick={(e) => !editing && onFolderOrFileClicks(e)}
        >
          {editing === cid && desktop ? (
            <Formik
              initialValues={{
                fileName: name
              }}
              validationSchema={renameSchema}
              onSubmit={(values) => {
                handleRename &&
                handleRename(
                  `${currentPath}${name}`,
                  `${currentPath}${values.fileName}`
                )
                setEditing(undefined)
              }}
            >
              <Form className={classes.desktopRename}>
                <FormikTextInput
                  className={classes.renameInput}
                  name="fileName"
                  inputVariant="minimal"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setEditing(undefined)
                    }
                  }}
                  placeholder = {isFolder
                    ? t`Please enter a file name`
                    : t`Please enter a folder name`
                  }
                  autoFocus={editing === cid}
                />
                <Button
                  variant="dashed"
                  size="small"
                  type="submit"
                >
                  <CheckSvg />
                </Button>
              </Form>
            </Formik>
          ) : (
            <Typography>{name}</Typography>
          )}
        </TableCell>
        {desktop && (
          <>
            <TableCell align="left">
              {
                created_at && dayjs.unix(created_at).format("DD MMM YYYY h:mm a")
              }
            </TableCell>
            <TableCell align="left">
              {!isFolder && formatBytes(size)}
            </TableCell>
          </>
        )}
        <TableCell align="right">
          <MenuDropdown
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
)

FileSystemTableItem.displayName = "FileSystemTableItem"

export default FileSystemTableItem
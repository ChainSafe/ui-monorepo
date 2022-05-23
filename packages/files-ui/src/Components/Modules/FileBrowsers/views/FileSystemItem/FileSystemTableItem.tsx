import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { makeStyles, createStyles, useThemeSwitcher, useOnClickOutside, LongPressEvents } from "@chainsafe/common-theme"
import { t } from "@lingui/macro"
import clsx from "clsx"
import {
  CheckboxInput,
  formatBytes,
  FormikTextInput,
  IMenuItem,
  Loading,
  MoreIcon,
  TableCell,
  TableRow,
  Typography
} from "@chainsafe/common-components"
import { CSFTheme } from "../../../../../Themes/types"
import dayjs from "dayjs"
import { FileSystemItem } from "../../../../../Contexts/FilesContext"
import { ConnectDragPreview } from "react-dnd"
import { Form, FormikProvider, useFormik } from "formik"
import { nameValidator } from "../../../../../Utils/validationSchema"
import Menu from "../../../../../UI-components/Menu"
import { getFileNameAndExtension } from "../../../../../Utils/Helpers"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {
  const desktopGridSettings = "50px 69px 3fr 190px 100px 45px !important"
  const mobileGridSettings = "69px 3fr 45px !important"

  return createStyles({
    tableRow: {
      border: "1px solid transparent",
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileGridSettings
      },
      "&.droppable": {
        border: `1px solid ${constants.fileSystemItemRow.borderColor}`
      },
      "&.highlighted": {
        border: `1px solid ${constants.fileSystemItemRow.borderColor}`
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
    desktopRename: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "& svg": {
        width: 20,
        height: 20
      },
      "& > span": {
        fontSize: 16,
        lineHeight: "20px",
        marginLeft: constants.generalUnit / 2
      }
    },
    filename: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      userSelect: "none",
      "&.editing": {
        overflow: "visible"
      }
    },
    dropdownIcon: {
      width: 14,
      height: 14,
      padding: 0,
      position: "relative",
      fontSize: "unset",
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon,
        top: "50%",
        left: 0,
        width: 14,
        height: 14,
        position: "absolute"
      }
    },
    focusVisible: {
      backgroundColor: "transparent !important"
    },
    loadingIcon: {
      marginLeft: constants.generalUnit,
      verticalAlign: "middle"
    }
  })
})

interface IFileSystemTableItemProps {
  isFolder: boolean
  isOverMove: boolean
  isOverUpload: boolean
  selectedCids: string[]
  file: FileSystemItem
  editing?: string
  handleItemSelectOnCheck: (e: React.MouseEvent) => void
  onFolderOrFileClicks: (e?: React.MouseEvent) => void
  icon: React.ReactNode
  preview: ConnectDragPreview
  setEditing: (editing: string | undefined) => void
  handleRename?: (path: string, newPath: string) => Promise<void> | undefined
  currentPath: string | undefined
  menuItems: IMenuItem[]
  longPressEvents?: LongPressEvents
}

const FileSystemTableItem = React.forwardRef(
  ({
    isFolder,
    isOverMove,
    isOverUpload,
    selectedCids,
    file,
    editing,
    handleItemSelectOnCheck,
    onFolderOrFileClicks,
    icon,
    preview,
    setEditing,
    handleRename,
    menuItems,
    longPressEvents
  }: IFileSystemTableItemProps, forwardedRef: any) => {
    const classes = useStyles()
    const { name, cid, created_at, size } = file
    const { desktop } = useThemeSwitcher()
    const formRef = useRef(null)
    const [isEditingLoading, setIsEditingLoading] = useState(false)

    const { fileName, extension } = useMemo(() => {
      return getFileNameAndExtension(name, isFolder)
    }, [name, isFolder])

    const formik = useFormik({
      initialValues: { name: fileName },
      validationSchema: nameValidator,
      onSubmit: (values: { name: string }) => {

        const newName = extension !== "" ? `${values.name.trim()}.${extension}` : values.name.trim()

        if (newName !== name && !!newName && handleRename) {
          setIsEditingLoading(true)

          handleRename(file.cid, newName)
            ?.then(() => setIsEditingLoading(false))
        } else {
          stopEditing()
        }
      },
      enableReinitialize: true
    })

    const stopEditing = useCallback(() => {
      setEditing(undefined)
      formik.resetForm()
    }, [formik, setEditing])

    useOnClickOutside(formRef, formik.submitForm)

    const renameInputRef = useRef<HTMLInputElement | null>()

    useEffect(() => {
      if (editing && renameInputRef?.current) {
        renameInputRef.current.focus()
      }
    }, [editing])

    return (
      <TableRow
        data-cy="row-file-item"
        className={clsx(classes.tableRow, {
          droppable: isFolder && (isOverMove || isOverUpload),
          highlighted: !desktop && selectedCids.includes(cid)
        })}
        type="grid"
        ref={forwardedRef}
        selected={selectedCids.includes(cid)}
      >
        {desktop && (
          <TableCell>
            <CheckboxInput
              value={selectedCids.includes(cid)}
              onClick={handleItemSelectOnCheck}
            />
          </TableCell>
        )}
        <TableCell
          className={clsx(classes.fileIcon, isFolder && classes.folderIcon)}
          onClick={(e) => onFolderOrFileClicks(e)}
          {...longPressEvents}
        >
          {icon}
        </TableCell>
        <TableCell
          data-cy="label-file-item-name"
          ref={preview}
          align="left"
          className={clsx(classes.filename, desktop && editing === cid && "editing")}
          onClick={(e) => !editing && onFolderOrFileClicks(e)}
          {...longPressEvents}
        >
          { editing === cid && desktop
            ? (
              <FormikProvider value={formik}>
                <Form
                  className={classes.desktopRename}
                  data-cy='form-rename'
                  ref={formRef}
                >
                  <FormikTextInput
                    className={classes.renameInput}
                    data-cy='input-rename-file-or-folder'
                    name="name"
                    inputVariant="minimal"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        stopEditing()
                      }
                    }}
                    placeholder={isFolder
                      ? t`Please enter a folder name`
                      : t`Please enter a file name`
                    }
                    ref={renameInputRef}
                  />
                  {
                    !isFolder && extension !== "" && (
                      <Typography component="span">
                        { `.${extension}` }
                      </Typography>
                    )
                  }
                </Form>
              </FormikProvider>
            )
            : <>
              <Typography>{name}</Typography>
              {isEditingLoading && <Loading
                className={classes.loadingIcon}
                size={16}
                type="initial"
              />}
            </>}
        </TableCell>
        {desktop && (
          <>
            <TableCell align="left">
              {!isFolder && !!created_at && dayjs.unix(created_at).format("DD MMM YYYY h:mm a")}
            </TableCell>
            <TableCell align="left">
              {!isFolder && formatBytes(size, 2)}
            </TableCell>
          </>
        )}
        <TableCell align="right">
          {!!menuItems.length && (
            <Menu
              testId='file-item-kebab'
              icon={<MoreIcon className={classes.dropdownIcon} />}
              options={menuItems}
              style={{ focusVisible: classes.focusVisible }}
            />
          )}
        </TableCell>
      </TableRow>
    )
  }
)

FileSystemTableItem.displayName = "FileSystemTableItem"

export default FileSystemTableItem


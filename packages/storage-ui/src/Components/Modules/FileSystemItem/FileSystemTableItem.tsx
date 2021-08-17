import React, { useCallback, useState } from "react"
import { makeStyles, createStyles, useThemeSwitcher, debounce } from "@chainsafe/common-theme"
import { t, Trans } from "@lingui/macro"
import clsx from "clsx"
import {
  CheckboxInput,
  CopySvg,
  formatBytes,
  FormikTextInput,
  IMenuItem,
  MenuDropdown,
  MoreIcon,
  TableCell,
  TableRow,
  Typography
} from "@chainsafe/common-components"
import dayjs from "dayjs"
import { ConnectDragPreview } from "react-dnd"
import { Form, FormikProvider, useFormik } from "formik"
import { CSSTheme } from "../../../Themes/types"
import { FileSystemItem } from "../../../Contexts/StorageContext"
import { nameValidator } from "../../../Utils/validationSchema"
import { ISelectedFile, useFileBrowser } from "../../../Contexts/FileBrowserContext"
import { desktopGridSettings, mobileGridSettings } from "../FilesList/FilesList"

const useStyles = makeStyles(({ animation, breakpoints, constants, palette, zIndex }: CSSTheme) => {
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
      color: constants.fileSystemItemRow.itemColor,
      "& a": {
        textDecoration: "none"
      }
    },
    cidWrapper: {
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    copyButton: {
      margin: "0 auto"
    },
    copyArea: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      cursor: "pointer",
      maxWidth: "200px",
      "& > p": {
        maxWidth: `calc(100% - ${constants.generalUnit + 15}px)`,
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    },
    copiedFlag: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      left: "50%",
      bottom: "calc(100% + 5px)",
      position: "absolute",
      transform: "translate(-50%, 0%)",
      zIndex: zIndex?.layer1,
      transitionDuration: `${animation.transform}ms`,
      opacity: 0,
      visibility: "hidden",
      backgroundColor: constants.loginModule.flagBg,
      color: constants.loginModule.flagText,
      padding: `${constants.generalUnit / 2}px ${constants.generalUnit}px`,
      borderRadius: 2,
      "&:after": {
        transitionDuration: `${animation.transform}ms`,
        content: "''",
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translate(-50%,0)",
        width: 0,
        height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: `5px solid ${constants.loginModule.flagBg}`
      },
      "&.active": {
        opacity: 1,
        visibility: "visible"
      }
    },
    copyIcon: {
      transitionDuration: `${animation.transform}ms`,
      fill: constants.loginModule.iconColor,
      height: 15,
      width: 15,
      marginLeft: constants.generalUnit,
      "&.active": {
        fill: palette.primary.main
      }
    }
    // copyContainer: {
    //   position: "relative",
    //   cursor: "pointer"
    // },
    // copiedFlag: {
    //   display: "flex",
    //   flexDirection: "column",
    //   alignItems: "center",
    //   justifyContent: "center",
    //   left: "50%",
    //   bottom: "calc(100% + 5px)",
    //   position: "absolute",
    //   transform: "translate(-50%, 0%)",
    //   zIndex: zIndex?.layer1,
    //   transitionDuration: `${animation.transform}ms`,
    //   opacity: 0,
    //   visibility: "hidden",
    //   backgroundColor: palette.additional["gray"][9],
    //   color: palette.additional["gray"][1],
    //   padding: `${constants.generalUnit / 2}px ${constants.generalUnit}px`,
    //   borderRadius: 2,
    //   "&:after": {
    //     transitionDuration: `${animation.transform}ms`,
    //     content: "''",
    //     position: "absolute",
    //     top: "100%",
    //     left: "50%",
    //     transform: "translate(-50%,0)",
    //     width: 0,
    //     height: 0,
    //     borderLeft: "5px solid transparent",
    //     borderRight: "5px solid transparent",
    //     borderTop: `5px solid ${ palette.additional["gray"][9]}`
    //   },
    //   "&.active": {
    //     opacity: 1,
    //     visibility: "visible"
    //   }
    // }
  })
})

interface IFileSystemTableItemProps {
  isFolder: boolean
  isOverMove: boolean
  isOverUpload: boolean
  selected: ISelectedFile[]
  file: FileSystemItem
  editing: ISelectedFile | undefined
  handleAddToSelectedCids: (selected: ISelectedFile) => void
  onFolderOrFileClicks: (e?: React.MouseEvent) => void
  icon: React.ReactNode
  preview: ConnectDragPreview
  setEditing: (editing: ISelectedFile |  undefined) => void
  handleRename?: (toRename: ISelectedFile, newPath: string) => Promise<void>
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
    setEditing,
    handleRename,
    menuItems
  }: IFileSystemTableItemProps, forwardedRef: any) => {
    const classes = useStyles()
    const { fileSystemType } = useFileBrowser()
    const { name, cid, created_at, size } = file
    const { desktop } = useThemeSwitcher()

    const formik = useFormik({
      initialValues: {
        fileName: name
      },
      validationSchema: nameValidator,
      onSubmit: (values) => {
        const newName = values.fileName?.trim()

        newName && handleRename && handleRename({
          cid: file.cid,
          name: file.name
        }, newName)
      },
      enableReinitialize: true
    })

    const stopEditing = useCallback(() => {
      setEditing(undefined)
      formik.resetForm()
    }, [formik, setEditing])

    const [copied, setCopied] = useState(false)
    const debouncedSwitchCopied = debounce(() => setCopied(false), 3000)

    const onCopyCID = () => {
      if (cid) {
        navigator.clipboard.writeText(cid)
          .then(() => {
            setCopied(true)
            debouncedSwitchCopied()
          }).catch(console.error)
      }
    }

    return  (
      <TableRow
        data-cy="file-item-row"
        className={clsx(classes.tableRow, {
          droppable: isFolder && (isOverMove || isOverUpload),
          ipfs: desktop && fileSystemType && fileSystemType === "ipfs"
        })}
        type="grid"
        ref={forwardedRef}
        selected={selected.findIndex(item => item.name === file.name && item.cid === file.cid) >= 0}
      >
        {desktop && (
          <TableCell>
            <CheckboxInput
              value={selected.findIndex(item => item.name === file.name && item.cid === file.cid) >= 0}
              onChange={() => handleAddToSelectedCids({
                cid,
                name
              })}
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
          data-cy="file-item-name"
          ref={preview}
          align="left"
          className={clsx(classes.filename, desktop && (editing?.cid === cid && editing.name === name) && "editing")}
          onClick={(e) => !editing && onFolderOrFileClicks(e)}
        >
          {(editing?.cid === cid && editing.name === name) && desktop
            ? (
              <FormikProvider value={formik}>
                <Form
                  className={classes.desktopRename}
                  onBlur={stopEditing}
                  data-cy='rename-form'
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
                    placeholder = {isFolder
                      ? t`Please enter a folder name`
                      : t`Please enter a file name`
                    }
                    autoFocus={editing.cid === cid && editing.name === name}
                  />
                </Form>
              </FormikProvider>
            )
            : <Typography>{name}</Typography>
          }
        </TableCell>
        {desktop && (
          <>
            {
              fileSystemType && fileSystemType !== "ipfs" &&
                <TableCell align="left">
                  {!isFolder && !!created_at && dayjs.unix(created_at).format("DD MMM YYYY h:mm a")}
                </TableCell>
            }
            {
              <TableCell>
                {!isFolder && <>
                  <div
                    className={classes.copyArea}
                    onClick={onCopyCID}>
                    <div className={clsx(classes.copiedFlag, { "active": copied })}>
                      <span>
                        <Trans>
                        Copied!
                        </Trans>
                      </span>
                    </div>
                    <Typography component="p">
                      { cid }
                    </Typography>
                    <CopySvg className={clsx(classes.copyIcon, { "active": copied })} />
                  </div>
                </>}
              </TableCell>
            }
            <TableCell align="left">
              {!isFolder && formatBytes(size, 2)}
            </TableCell>
          </>
        )}
        <TableCell align="right">
          <MenuDropdown
            testId='fileDropdown'
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

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { t } from "@lingui/macro"
import clsx from "clsx"
import {
  FormikTextInput,
  IMenuItem,
  Loading,
  MenuDropdown,
  MoreIcon,
  Typography
} from "@chainsafe/common-components"
import { CSSTheme } from "../../../Themes/types"
import { FileSystemItem } from "../../../Contexts/StorageContext"
import { ConnectDragPreview } from "react-dnd"
import { Form, FormikProvider, useFormik } from "formik"
import { nameValidator } from "../../../Utils/validationSchema"
import { ISelectedFile } from "../../../Contexts/FileBrowserContext"
import { getFileNameAndExtension } from "../../../Utils/Helpers"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSSTheme) => {
  return createStyles({
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
    gridIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: constants.generalUnit * 16,
      maxWidth: constants.generalUnit * 24,
      border: `1px solid ${palette.additional["gray"][6]}`,
      boxShadow: constants.filesTable.gridItemShadow,
      "& svg": {
        width: "30%"
      },
      [breakpoints.down("lg")]: {
        height: constants.generalUnit * 16
      },
      [breakpoints.down("sm")]: {
        height: constants.generalUnit * 16
      },
      "&.highlighted": {
        border: `1px solid ${palette.primary.main}`
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
    },
    gridViewContainer: {
      display: "flex",
      flex: 1,
      maxWidth: constants.generalUnit * 24
    },
    gridFolderName: {
      textAlign: "center",
      wordBreak: "break-all",
      overflowWrap: "break-word",
      padding: constants.generalUnit
    },
    gridViewIconNameBox: {
      display: "flex",
      flexDirection: "column",
      width: "100%"
    },
    menuTitleGrid: {
      padding: `0 ${constants.generalUnit * 0.5}px`,
      [breakpoints.down("md")]: {
        padding: 0
      }
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
  selected: ISelectedFile[]
  file: FileSystemItem
  editingFile?: ISelectedFile
  onFolderOrFileClicks: (e?: React.MouseEvent) => void
  icon: React.ReactNode
  preview: ConnectDragPreview
  setEditingFile: (editingFile: ISelectedFile |  undefined) => void
  handleRename?: (item: ISelectedFile, newName: string) => Promise<void> | undefined
  currentPath: string | undefined
  menuItems: IMenuItem[]
  resetSelectedFiles: () => void
}

const FileSystemGridItem = React.forwardRef(
  ({
    isFolder,
    isOverMove,
    isOverUpload,
    selected,
    file,
    editingFile,
    onFolderOrFileClicks,
    icon,
    setEditingFile,
    handleRename,
    menuItems,
    resetSelectedFiles,
    preview
  }: IFileSystemTableItemProps, forwardedRef: any) => {
    const classes = useStyles()
    const { name, cid } = file
    const { desktop } = useThemeSwitcher()
    const [isEditingLoading, setIsEditingLoading] = useState(false)

    const { fileName, extension } = useMemo(() => {
      return getFileNameAndExtension(name, isFolder)
    }, [name, isFolder])

    const formik = useFormik({
      initialValues: {
        name: fileName
      },
      validationSchema: nameValidator,
      onSubmit: (values) => {
        const newName = extension !== "" ? `${values.name.trim()}.${extension}` : values.name.trim()

        if (newName !== name && !!newName && handleRename && editingFile) {
          setIsEditingLoading(true)

          handleRename(editingFile, newName)
            ?.then(() => setIsEditingLoading(false))
        } else {
          stopEditing()
        }
      },
      enableReinitialize: true
    })

    const handleClickOutside = useCallback(
      (e) => {
        if (forwardedRef.current && forwardedRef.current.contains(e.target)) {
          // inside click
          return
        }
        if (e.defaultPrevented || e.isPropagationStopped) {
          return
        }
        // outside click
        resetSelectedFiles()
      },
      [resetSelectedFiles, forwardedRef]
    )

    useEffect(() => {
      document.addEventListener("click", handleClickOutside)
      return () => {
        document.removeEventListener("click", handleClickOutside)
      }
    }, [handleClickOutside])

    const stopEditing = useCallback(() => {
      setEditingFile(undefined)
      formik.resetForm()
    }, [formik, setEditingFile])

    return  (
      <div
        className={classes.gridViewContainer}
        ref={forwardedRef}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <div
          className={clsx(classes.gridViewIconNameBox)}
          ref={preview}
          onClick={(e) => onFolderOrFileClicks(e)}
        >
          <div
            className={clsx(
              classes.fileIcon,
              isFolder && classes.folderIcon,
              classes.gridIcon,
              (isOverMove || isOverUpload || selected.findIndex(
                item => item.cid === file.cid && item.name === file.name) >= 0) && "highlighted"
            )}
          >
            {icon}
          </div>
          {/* checking the name is useful for MFS folders since empty folders all have the same cid */}
          {editingFile?.cid === cid && editingFile.name === name && desktop
            ? (<FormikProvider value={formik}>
              <Form
                className={classes.desktopRename}
                onBlur={formik.submitForm}
              >
                <FormikTextInput
                  className={classes.renameInput}
                  name="name"
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
                  autoFocus
                />
                {
                  !isFolder && extension !== ""  && (
                    <Typography component="span">
                      { `.${extension}` }
                    </Typography>
                  )
                }
              </Form>
            </FormikProvider>
            ) : <div className={classes.gridFolderName}>
              {name}{isEditingLoading && <Loading
                className={classes.loadingIcon}
                size={16}
                type="initial"
              />}
            </div>
          }
        </div>
        <MenuDropdown
          animation="none"
          anchor="bottom-right"
          menuItems={menuItems}
          classNames={{
            icon: classes.dropdownIcon,
            options: classes.dropdownOptions,
            item: classes.dropdownItem,
            title: classes.menuTitleGrid
          }}
          indicator={MoreIcon}
        />

      </div>
    )
  }
)

FileSystemGridItem.displayName = "FileSystemGridItem"

export default FileSystemGridItem

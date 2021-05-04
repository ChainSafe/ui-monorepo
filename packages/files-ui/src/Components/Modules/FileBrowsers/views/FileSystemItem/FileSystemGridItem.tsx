import React from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { t } from "@lingui/macro"
import clsx from "clsx"
import {
  FormikTextInput,
  IMenuItem,
  MenuDropdown,
  MoreIcon
} from "@chainsafe/common-components"
import { CSFTheme } from "../../../../../Themes/types"
import { FileSystemItem } from "../../../../../Contexts/DriveContext"
import { ConnectDragPreview } from "react-dnd"
import { Form, Formik } from "formik"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {
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
        border: `1px solid ${palette.additional["geekblue"][6]}`
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
      flexDirection: "column"
    },
    menuTitleGrid: {
      padding: `0 ${constants.generalUnit * 0.5}px`,
      [breakpoints.down("md")]: {
        padding: 0
      }
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
  attachRef: (element: any) => void
  handleSelect: (selected: string) => void
  onFolderOrFileClicks: () => void
  icon: React.ReactNode
  preview: ConnectDragPreview
  renameSchema: any
  setEditing: (editing: string |  undefined) => void
  handleRename?: (path: string, newPath: string) => Promise<void>
  currentPath: string | undefined
  menuItems: IMenuItem[]
}

function FileSystemGridItem({
  isFolder,
  isOverMove,
  isOverUpload,
  selected,
  file,
  editing,
  attachRef,
  onFolderOrFileClicks,
  icon,
  renameSchema,
  setEditing,
  handleRename,
  currentPath,
  menuItems
}: IFileSystemTableItemProps) {
  const classes = useStyles()
  const { name, cid } = file
  const { desktop } = useThemeSwitcher()

  return  (
    <div className={classes.gridViewContainer}>
      <div
        className={clsx(classes.gridViewIconNameBox)}
        ref={!editing ? attachRef : null}
        onClick={onFolderOrFileClicks}
      >
        <div
          className={clsx(
            classes.fileIcon,
            isFolder && classes.folderIcon,
            classes.gridIcon,
            (isOverMove || isOverUpload || selected.includes(cid)) && "highlighted"
          )}
        >
          {icon}
        </div>
        {editing === cid && desktop ? (
          <Formik
            initialValues={{
              fileName: name
            }}
            validationSchema={renameSchema}
            onSubmit={(values) => {
              handleRename && handleRename(
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
            </Form>
          </Formik>
        ) : (
          <div className={classes.gridFolderName}>{name}</div>
        )}
      </div>
      <div>
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
    </div>
  )
}

export default FileSystemGridItem

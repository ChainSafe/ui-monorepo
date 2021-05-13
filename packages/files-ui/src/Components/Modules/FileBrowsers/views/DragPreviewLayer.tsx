import { FolderFilledSvg, FileImageSvg, FilePdfSvg, FileTextSvg, formatBytes,
  MenuDropdown, MoreIcon, TableCell, TableRow, Typography, CheckboxInput } from "@chainsafe/common-components"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import clsx from "clsx"
import dayjs from "dayjs"
import React from "react"
import { useDragLayer, XYCoord } from "react-dnd"
import { FileSystemItem } from "../../../../Contexts/DriveContext"
import { CSFTheme } from "../../../../Themes/types"
import { DragTypes } from "../DragConstants"
import { BrowserView } from "../types"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) => {
  const desktopGridSettings = "50px 69px 3fr 190px 100px 45px !important"
  const mobileGridSettings = "69px 3fr 45px !important"

  return createStyles({
    tableRow: {
      width: "calc(100vw - 504px)",
      border: "2px solid transparent",
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileGridSettings
      },
      "&.droppable": {
        border: `2px solid ${palette.additional["geekblue"][6]}`
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
    filename: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      "&.editing": {
        overflow: "visible"
      }
    },
    previewDragLayer: {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 100,
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
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
      width: "100%",
      cursor: "pointer"
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
    menuTitleGrid: {
      padding: `0 ${constants.generalUnit * 0.5}px`,
      [breakpoints.down("md")]: {
        padding: 0
      }
    }
  })})

const DragPreviewTableItem: React.FC<{item: FileSystemItem; icon: React.ReactNode}> = ({
  item: { name, isFolder, created_at, size },
  icon
}) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  return (
    <TableRow
      className={classes.tableRow}
      type="grid"
    >
      {desktop && (
        <TableCell>
          <CheckboxInput
            value={false}
            onChange={() => {return}}
          />
        </TableCell>
      )}
      <TableCell
        className={clsx(classes.fileIcon, isFolder && classes.folderIcon)}
      >
        {icon}
      </TableCell>
      <TableCell
        align="left"
        className={classes.filename}
      >
        <Typography>{name}</Typography>
      </TableCell>
      {desktop && (
        <>
          <TableCell align="left">
            {
              !isFolder && created_at && dayjs.unix(created_at).format("DD MMM YYYY h:mm a")
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
          menuItems={[]}
          classNames={{
            icon: classes.dropdownIcon,
            options: classes.dropdownOptions
          }}
          indicator={MoreIcon}
        />
      </TableCell>
    </TableRow>
  )
}


const DragPreviewGridItem: React.FC<{item: FileSystemItem; icon: React.ReactNode}> = ({
  item: { name, isFolder },
  icon
}) => {
  const classes = useStyles()
  return (
    <div className={classes.gridViewContainer}>
      <div
        className={clsx(classes.gridViewIconNameBox)}
      >
        <div
          className={clsx(
            classes.fileIcon,
            isFolder && classes.folderIcon,
            classes.gridIcon
          )}
        >
          {icon}
        </div>

        <div className={classes.gridFolderName}>{name}</div>
      </div>
      <div>
        <MenuDropdown
          animation="none"
          anchor="bottom-right"
          menuItems={[]}
          classNames={{
            icon: classes.dropdownIcon,
            options: classes.dropdownOptions,
            title: classes.menuTitleGrid
          }}
          indicator={MoreIcon}
        />
      </div>
    </div>
  )
}

export const DragPreviewLayer: React.FC<{items: FileSystemItem[]; previewType: BrowserView} > = ({ items, previewType }) => {
  const classes = useStyles()
  const { isDragging, dragItems, itemType, currentOffset } = useDragLayer(monitor => ({
    itemType: monitor.getItemType(),
    dragItems: monitor.getItem() as {ids: string[]},
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset()
  }))

  const getItemStyles = (currentOffset: XYCoord | null) => {
    if (!currentOffset) {
      return {
        display: "none"
      }
    }
    const { x, y } = currentOffset

    const transform = `translate(${x}px, ${y}px)`
    return {
      transform,
      WebkitTransform: transform
    }
  }

  return (!isDragging || itemType !== DragTypes.MOVABLE_FILE)
    ? null
    : <div className={classes.previewDragLayer}>
      <ul style={getItemStyles(currentOffset)}>
        {dragItems.ids.map(di => {
          const previewItem = items.find(i => i.cid === di)

          if (previewItem) {
            let Icon
            if (previewItem.isFolder) {
              Icon = FolderFilledSvg
            } else if (previewItem.content_type.includes("image")) {
              Icon = FileImageSvg
            } else if (previewItem.content_type.includes("pdf")) {
              Icon = FilePdfSvg
            } else {
              Icon = FileTextSvg
            }

            return (previewType === "table")
              ? <DragPreviewTableItem item={previewItem}
                icon={<Icon />}
                key={previewItem.cid} />
              : <DragPreviewGridItem item={previewItem}
                icon={<Icon />}
                key={previewItem.cid} />
          } else {
            return null
          }})}
      </ul>
    </div>
}
import { Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@material-ui/core"
import clsx from "clsx"
import React, { useRef } from "react"
import { useDrop } from "react-dnd"
import { NativeTypes } from "react-dnd-html5-backend"
import { CSFTheme } from "../../../../Themes/types"
import { DragTypes } from "../DragConstants"

const useStyles = makeStyles(
  ({  palette  }: CSFTheme) => {
    return createStyles({
      crumb: {
        fontSize: 14,
        display: "inline-block",
        cursor: "pointer",
        maxWidth: 120,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      wrapper: {
        border: "1px solid transparent",
        padding: "0 4px",
        "&.active": {
          borderColor: palette.primary.main
        }
      },
      fullWidth: {
        width: "100%"
      }
    })
  }
)

interface IFolderBreadcrumb {
  onClick?: () => void
  folderName: string
  handleMove: (item: any) => void
  handleUpload: (item: any) => void
}

const FolderBreadcrumb = ({ onClick, folderName, handleMove, handleUpload }: IFolderBreadcrumb) => {
  const classes = useStyles()

  const [{ isOverUploadFolderBreadcrumb }, dropUploadFolderBreadcrumbRef] = useDrop({
    accept: [NativeTypes.FILE],
    drop: handleUpload,
    collect: (monitor) => ({
      isOverUploadFolderBreadcrumb: monitor.isOver()
    })
  })

  const [{ isOverMoveFolderBreadcrumb }, dropMoveFolderBreadcrumbRef] = useDrop({
    accept: DragTypes.MOVABLE_FILE,
    drop: handleMove,
    collect: (monitor) => ({
      isOverMoveFolderBreadcrumb: monitor.isOver()
    })
  })

  const folderBreadcrumbRef = useRef<HTMLDivElement>(null)
  dropMoveFolderBreadcrumbRef(folderBreadcrumbRef)
  dropUploadFolderBreadcrumbRef(folderBreadcrumbRef)

  return (
    <div
      ref={folderBreadcrumbRef}
      className={clsx(
        (isOverMoveFolderBreadcrumb || isOverUploadFolderBreadcrumb) && "active",
        classes.wrapper
      )}
    >
      <Typography
        onClick={onClick}
        className={classes.crumb}
        variant="body1"
      >
        {folderName}
      </Typography>
    </div>
  )
}

export default FolderBreadcrumb
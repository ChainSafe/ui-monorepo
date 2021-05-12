import { makeStyles } from "@chainsafe/common-theme"
import React from "react"
import { useDragLayer, XYCoord } from "react-dnd"
import { FileSystemItem } from "../../../../Contexts/DriveContext"
import { DragTypes } from "../DragConstants"

const useStyles = makeStyles(() => ({
  previewDragLayer: {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  }
}))

export const DragPreviewLayer: React.FC<{items: FileSystemItem[]}> = ({ items }) => {
  const classes = useStyles()
  const { isDragging, dragItems, itemType, initialOffset, currentOffset } = useDragLayer(monitor => ({
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
    console.log(initialOffset)
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
            return (
              <li key={previewItem?.cid}>
                {previewItem?.name}
              </li>
            )} else {
            return null
          }})}
      </ul>
    </div>
}
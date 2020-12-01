import React from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import FileBrowser from "./FileBrowser"

const FileBrowserModule: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FileBrowser />
    </DndProvider>
  )
}

export default FileBrowserModule

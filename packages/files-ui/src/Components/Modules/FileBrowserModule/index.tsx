import React from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import FileBrowser from "./FileBrowser"
import { IFilesBrowserModuleProps } from "./types"

const FileBrowserModule: React.FC<IFilesBrowserModuleProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FileBrowser {...props} />
    </DndProvider>
  )
}

export default FileBrowserModule

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import React from "react"

const DragAndDrop: React.FC = ({ children }) => (
  <DndProvider backend={HTML5Backend}>
    {children}
  </DndProvider>
)

export default DragAndDrop

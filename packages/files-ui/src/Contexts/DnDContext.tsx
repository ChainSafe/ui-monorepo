import { createDndContext, DndContextType, DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import React, { useRef } from "react"

const RNDContext = createDndContext(HTML5Backend)

const DragAndDrop: React.FC = ({ children }) => {
  const manager = useRef<DndContextType>(RNDContext)
  if (manager.current?.dragDropManager) {
    return (
      <DndProvider manager={manager.current.dragDropManager}>
        {children}
      </DndProvider>
    )
  }
  return <>{children}</>
}

export default DragAndDrop

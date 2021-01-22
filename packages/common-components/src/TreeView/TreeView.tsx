import React, { ReactNode } from "react"
import TreeNode, { ITreeNodeProps } from "./TreeNode"

export interface ITreeViewProps {
  treeData: ITreeNodeProps[]
  commonIcon?: ReactNode
  selectedId?: string
  onSelectNode?: any
}

const TreeView: React.FC<ITreeViewProps> = ({
  treeData,
  commonIcon,
  selectedId,
  onSelectNode,
}) => {
  return treeData.length ? (
    <ul>
      {treeData.map((subTree) => (
        <TreeNode
          {...subTree}
          commonIcon={commonIcon}
          selectedId={selectedId}
          onSelectNode={onSelectNode}
        />
      ))}
    </ul>
  ) : null
}

export default TreeView

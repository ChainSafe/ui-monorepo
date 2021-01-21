import React, { ReactNode } from "react"
import TreeNode, { ITreeNodeData } from "./TreeNode"

export interface ITreeViewData {
  treeData: ITreeNodeData[]
  commonIcon?: ReactNode
  selectedId?: string
  onSelectNode?: any
}

const TreeView: React.FC<ITreeViewData> = ({
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

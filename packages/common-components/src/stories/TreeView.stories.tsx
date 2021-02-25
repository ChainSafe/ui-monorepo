import React, { useState } from "react"
import { withKnobs } from "@storybook/addon-knobs"
import { TreeView, ITreeNodeProps } from "../TreeView"
import { FolderIcon } from "../Icons"

export default {
  title: "Tree view",
  component: TreeView,
  excludeStories: /.*Data$/,
  decorators: [withKnobs]
}

const treeArrData: ITreeNodeProps[] = [
  {
    title: "Bob",
    expandable: true,
    id: "1",
    tree: [
      {
        title: "Mary",
        id: "2",
        expandable: true,
        tree: [{ title: "Suzy", id: "3" }]
      },
      {
        title: "Phil",
        id: "4",
        expandable: true,
        tree: [
          { title: "Jon", id: "5" },
          { title: "Paul", id: "6" }
        ]
      }
    ]
  },
  {
    title: "Bob",
    expandable: true,
    id: "7",
    icon: <FolderIcon />,
    tree: [
      {
        title: "Mary",
        id: "8",
        expandable: true,
        tree: [{ title: "Suzy", id: "9", icon: <FolderIcon /> }]
      },
      {
        title: "Phil",
        id: "6",
        expandable: true,
        tree: [
          { title: "Jon", id: "10" },
          { title: "Paul", id: "11" }
        ]
      }
    ]
  }
]

export const TreeViewStory = (): React.ReactNode => {
  const [selectedId, setSelectedId] = useState<undefined | string>(undefined)
  return (
    <TreeView
      treeData={treeArrData}
      commonIcon={<FolderIcon />}
      selectedId={selectedId}
      onSelectNode={(id: string) => {
        setSelectedId(id)
      }}
    />
  )
}

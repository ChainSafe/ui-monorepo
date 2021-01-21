import React, { useState, ReactNode } from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    title: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: palette.additional["gray"][8],
      fontSize: constants.generalUnit * 2,
      padding: `${constants.generalUnit * 0.5}px`,
      "& svg": {
        fill: palette.additional["gray"][8],
      },
    },
    selected: {
      backgroundColor: palette.additional["gray"][4],
    },
    icon: {
      marginRight: constants.generalUnit,
    },
    subTree: {
      marginLeft: constants.generalUnit * 4,
    },
  }),
)

export interface ITreeNodeData {
  title: string
  id: string
  icon?: ReactNode
  expandable?: boolean
  onClick?: any
  tree?: ITreeNodeData[]
  commonIcon?: ReactNode
  selectedId?: string
  onSelectNode?: any
}

const TreeNode: React.FC<ITreeNodeData> = ({
  title,
  id,
  icon,
  commonIcon,
  expandable = true,
  onClick,
  tree,
  selectedId,
  onSelectNode,
}) => {
  const classes = useStyles()
  const [isExpanded, setIsExpanded] = useState(false)

  const toggle = () => {
    console.log("here", onSelectNode, selectedId)
    setIsExpanded(!isExpanded)
  }

  return (
    <li>
      <span
        onClick={() => {
          expandable && toggle()
          onClick && onClick()
          onSelectNode && onSelectNode(id)
        }}
        className={clsx(classes.title, selectedId === id && classes.selected)}
      >
        {icon || commonIcon ? (
          <span className={classes.icon}>{icon || commonIcon}</span>
        ) : null}
        {title}
      </span>
      {expandable && tree && isExpanded ? (
        <ul className={classes.subTree}>
          {tree.map((subTree) => (
            <TreeNode
              {...subTree}
              commonIcon={commonIcon}
              selectedId={selectedId}
              onSelectNode={onSelectNode}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default TreeNode

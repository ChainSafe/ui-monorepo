import React, { useState, ReactNode, useEffect } from "react"
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

export interface ITreeNodeProps {
  title: string
  id: string
  icon?: ReactNode
  expandable?: boolean
  isExpanded?: boolean
  onClick?: any
  tree?: ITreeNodeProps[]
  commonIcon?: ReactNode
  selectedId?: string
  onSelectNode?: any
}

const TreeNode: React.FC<ITreeNodeProps> = ({
  title,
  id,
  icon,
  commonIcon,
  expandable = true,
  onClick,
  tree,
  selectedId,
  onSelectNode,
  isExpanded: isExpandedProp,
}) => {
  const classes = useStyles()
  const [isExpanded, setIsExpanded] = useState(isExpandedProp)

  useEffect(() => {
    setIsExpanded(isExpandedProp)
  }, [isExpandedProp])

  const toggle = () => {
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
          {tree.map((subTree, i) => (
            <TreeNode
              {...subTree}
              commonIcon={commonIcon}
              selectedId={selectedId}
              onSelectNode={onSelectNode}
              key={i}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default TreeNode

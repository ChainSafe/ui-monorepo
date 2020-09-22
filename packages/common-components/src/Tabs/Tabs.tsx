import React from "react"
import clsx from "clsx"
import { makeStyles, createStyles } from "@chainsafe/common-themes"
import { ITheme } from "@chainsafe/common-themes"
import { ITabPaneProps } from "./TabPane"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    tabList: {
      padding: 0,
      marginBottom: 0,
      ...theme.typography.body1,
    },
    tabBar: {
      display: "inline-block",
      marginLeft: 0,
      padding: theme.constants.generalUnit * 1.5,
      borderBottom: "2px solid transparent",
      transition: `all ${theme.animation.transform}ms`,
      cursor: "pointer",
      "&.selected": {
        color: theme.palette.primary.main,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      },
    },
  }),
)

export interface ITabsProps {
  className?: string
  children: React.ReactElement<ITabPaneProps>[]
  activeKey: string
  onTabSelect(key: string): void
}

const Tabs: React.FC<ITabsProps> = ({
  className,
  children,
  activeKey,
  onTabSelect,
}: ITabsProps) => {
  const classes = useStyles()

  const selectedChild = children.find(
    (child) => activeKey === child.props.tabKey,
  )

  return (
    <div>
      <ul className={clsx(className, classes.tabList)}>
        {children.map((elem, index) => {
          console.log(elem.props)
          return (
            <li
              key={index}
              className={clsx(
                classes.tabBar,
                elem.props.tabKey === activeKey && "selected",
              )}
              onClick={() => onTabSelect(elem.props.tabKey)}
            >
              {elem.props.title}
            </li>
          )
        })}
      </ul>
      {selectedChild}
    </div>
  )
}

export default Tabs

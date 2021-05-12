import React from "react"
import clsx from "clsx"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { ITheme } from "@chainsafe/common-theme"
import { ITabPaneProps } from "./TabPane"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette, animation, typography, overrides }: ITheme) =>
    createStyles({
      root : {
        [breakpoints.down("md")]: {
          marginBottom: 0
        },
        ...overrides?.Tabs?.root
      },
      tabList: {
        padding: 0,
        marginBottom: 0,
        ...typography.body1,
        ...overrides?.Tabs?.tabList
      },
      tabBar: {
        display: "inline-block",
        marginLeft: 0,
        marginRight: `${constants.generalUnit * 2}px`,
        padding: `${constants.generalUnit * 1.5}px ${constants.generalUnit * 0.5}px`,
        borderBottom: "2px solid transparent",
        transition: `all ${animation.transform}ms`,
        cursor: "pointer",
        "&.selected": {
          fontWeight: "bold",
          borderBottom: `2px solid ${palette.additional["blue"][6]}`,
          ...overrides?.Tabs?.tabBar?.selected
        },
        [breakpoints.up("md")]: {
          "& .iconRight":{
            display: "none"
          }
        },
        ...overrides?.Tabs?.tabBar?.root
      }
    })
)

interface TabInjectedClasses {
  root?: string
  tabList?: string
  tabBar?: string
}

export interface ITabsProps {
  className?: string
  children: React.ReactElement<ITabPaneProps> | React.ReactElement<ITabPaneProps>[]
  activeKey: string
  onTabSelect: (key: string) => void
  injectedClass?: TabInjectedClasses
}

const Tabs: React.FC<ITabsProps> = ({ className, children, activeKey, injectedClass, onTabSelect }: ITabsProps) => {
  const classes = useStyles()
  const selectedChild = Array.isArray(children)
    ? children.find((child) => activeKey === child.props.tabKey)
    : children

  return (
    <div className={clsx(classes.root, injectedClass?.root)}>
      <ul className={clsx(className, classes.tabList, injectedClass?.tabList)}>
        {Array.isArray(children)
          ? children.map((elem, index) => {
            return (
              <li
                key={index}
                className={
                  clsx(
                    elem.props.tabKey === activeKey && "selected",
                    classes.tabBar,
                    injectedClass?.tabBar,
                    elem.props.tabKey
                  )}
                onClick={() => onTabSelect(elem.props.tabKey)}
              >
                {elem.props.icon}{elem.props.title}<span className="iconRight">{elem.props.iconRight}</span>
              </li>
            )
          })
          : <li
            className={
              clsx(
                children.props.tabKey === activeKey && "selected",
                classes.tabBar,
                injectedClass?.tabBar,
                children.props.tabKey
              )}
            onClick={() => onTabSelect(children.props.tabKey)}
          >
            {children.props.icon}{children.props.title}<span className="iconRight">{children.props.iconRight}</span>
          </li>
        }
      </ul>
      {selectedChild}
    </div>
  )
}

export default Tabs

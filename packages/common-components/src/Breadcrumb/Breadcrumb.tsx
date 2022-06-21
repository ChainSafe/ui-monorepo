import React, { Fragment, ReactNode, useMemo } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import { Typography } from "../Typography"
import { MenuDropdown } from "../MenuDropdown"

export type Crumb = {
  text: string
  path?: string
  onClick?: () => void
  forwardedRef?: React.Ref<HTMLDivElement>
  active?: boolean
  component?: React.ReactElement | null
}

export type BreadcrumbProps = {
  crumbs?: Crumb[]
  onRootClick?: () => void
  rootRef?: React.Ref<HTMLDivElement>
  rootActive?: boolean
  rootIcon: ReactNode
  className?: string
  showDropDown?: boolean
  maximumCrumbs?: number
}

const useStyles = makeStyles(
  ({ constants, palette, zIndex, overrides }: ITheme) =>
    createStyles({
      // JSS in CSS goes here
      root: {
        margin: 0,
        display: "flex",
        alignItems: "center",
        "& > *": {
          height: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        ...overrides?.Breadcrumb?.root
      },
      separator: {
        width: 1,
        margin: `0 ${constants.generalUnit}px`,
        height: 14,
        transform: "skew(-15deg)",
        backgroundColor: palette.additional["gray"][7],
        zIndex: zIndex?.background,
        ...overrides?.Breadcrumb?.separator
      },
      crumb: {
        fontSize: 14,
        display: "inline-block",
        "&.clickable": {
          cursor: "pointer"
        },
        maxWidth: 120,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...overrides?.Breadcrumb?.crumb
      },
      menuItem: {
        padding: `${constants.generalUnit}px ${constants.generalUnit * 1.5}px`,
        color: palette.additional["gray"][9]
      },
      menuTitleText: {
        fontSize: 14,
        maxWidth: 100,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      menuTitle: {
        padding: `0px ${constants.generalUnit * 1.5}px 0px ${constants.generalUnit * 0.5}px`
      },
      menuOptions: {
        zIndex: zIndex?.layer1
      },
      menuIcon: {
        width: 12,
        height: 12,
        "& svg": {
          height: 12,
          width: 12,
          fill: palette.additional["gray"][9]
        }
      },
      wrapper: {
        border: "1px solid transparent",
        padding: `0 ${constants.generalUnit * 0.5}px`,
        "&.active": {
          borderColor: palette.primary.main
        },
        width: "fit-content",
        margin: "3px 0",
        "& svg": {
          display: "block",
          height: "100%"
        },
        "&.clickable": {
          cursor: "pointer"
        },
        ...overrides?.Breadcrumb?.home
      },
      fullWidth: {
        width: "100%"
      }
    })
)

const CrumbComponent = ({ crumb }: {crumb: Crumb}) => {
  const classes = useStyles()
  return (
    !crumb.component
      ? <div
        ref={crumb.forwardedRef}
        className={clsx(crumb.active && "active", classes.wrapper)}
      >
        <Typography
          onClick={() => crumb.onClick && crumb.onClick()}
          className={clsx(classes.crumb, crumb.onClick && "clickable")}
          variant="body1"
        >
          {crumb.text}
        </Typography>
      </div>
      : crumb.component
  )
}

const Breadcrumb = ({
  crumbs = [],
  onRootClick,
  rootRef,
  rootActive,
  rootIcon,
  showDropDown,
  maximumCrumbs
}: BreadcrumbProps) => {
  const classes = useStyles()

  const maximumCrumbsBeforeCollapse = useMemo(() => maximumCrumbs || 3, [maximumCrumbs])

  const generateFullCrumbs = (crumbs: Crumb[]) => {
    return crumbs.map((crumb: Crumb, index: number) => (
      <Fragment key={`crumb-${index}`}>
        <CrumbComponent crumb={crumb} />
        {index < (crumbs.length - 1) && <div className={clsx(classes.separator)} />}
      </Fragment>
    ))
  }

  const generateDropdownCrumb = (crumbs: Crumb[]) => {
    return (
      <MenuDropdown
        title={crumbs[0].text}
        anchor="bottom-left"
        animation="rotate"
        classNames={{
          item: classes.menuItem,
          options: classes.menuOptions,
          title: classes.menuTitle,
          icon: classes.menuIcon,
          titleText: classes.menuTitleText
        }}
        menuItems={crumbs.map((crumb) => ({
          contents: <CrumbComponent crumb={crumb} />
        }))}
      />
    )
  }

  const generateCrumbs = () => {
    if (crumbs.length < (maximumCrumbs || 3) || !showDropDown) {
      return generateFullCrumbs(crumbs)
    } else {
      const dropdownCrumbs = crumbs.slice(0, crumbs.length - (maximumCrumbsBeforeCollapse - 2))
      const lastCrumbs = crumbs.slice(crumbs.length - (maximumCrumbsBeforeCollapse - 2), crumbs.length)
      return (
        <>
          {generateDropdownCrumb(dropdownCrumbs)}
          <div className={clsx(classes.separator)} />
          {generateFullCrumbs(lastCrumbs)}
        </>
      )
    }
  }

  return (
    <div className={classes.root}>
      <div
        ref={rootRef}
        className={clsx(classes.wrapper, rootActive && "active", onRootClick && "clickable")}
        onClick={() => onRootClick && onRootClick()}
      >
        {rootIcon}
      </div>
      {!!crumbs.length && <div className={clsx(classes.separator)} />}
      {generateCrumbs()}
    </div>
  )
}

export default Breadcrumb

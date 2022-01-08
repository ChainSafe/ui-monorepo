import React, { Fragment } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import { HomeIcon } from "../Icons"
import { Typography } from "../Typography"
import { MenuDropdown } from "../MenuDropdown"

export type Crumb = {
  text: string
  path?: string
  onClick?: () => void
  forwardedRef?: React.Ref<HTMLDivElement>
  active?: boolean
  component?: React.ReactElement
}

export type BreadcrumbProps = {
  crumbs?: Crumb[]
  homeOnClick?: () => void
  hideHome?: boolean
  homeRef?: React.Ref<HTMLDivElement>
  homeActive?: boolean
  className?: string
  showDropDown?: boolean
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
      home: {
        height: 16,
        width: "fit-content",
        margin: "3px 0",
        "& > svg": {
          display: "block",
          height: "100%"
        },
        "&.clickable": {
          cursor: "pointer"
        },
        ...overrides?.Breadcrumb?.home
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
        }
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
  homeOnClick,
  hideHome,
  homeRef,
  homeActive,
  className,
  showDropDown
}: BreadcrumbProps) => {
  const classes = useStyles()

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
    if (crumbs.length < 3 || !showDropDown) {
      return generateFullCrumbs(crumbs)
    } else {
      const dropdownCrumbs = crumbs.slice(0, crumbs.length - 1)
      const lastCrumb = crumbs[crumbs.length - 1]
      return (
        <>
          {generateDropdownCrumb(dropdownCrumbs)}
          <div className={clsx(classes.separator)} />
          <CrumbComponent crumb={lastCrumb} />
        </>
      )
    }
  }

  return (
    <div className={clsx(classes.root, className)}>
      {!hideHome && <>
        <div
          ref={homeRef}
          className={clsx(classes.wrapper, homeActive && "active")}
        >
          <HomeIcon
            className={clsx(classes.home, homeOnClick && "clickable")}
            onClick={() => homeOnClick && homeOnClick()}
          />
        </div>
        {!!crumbs.length && <div className={clsx(classes.separator)} />}
      </>
      }
      {generateCrumbs()}
    </div>
  )
}

export default Breadcrumb

import React, { Fragment } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import { HomeIcon } from "../Icons"
import { Typography } from "../Typography"
import { MenuDropdown } from "../MenuDropdown"

export type Crumb = {
  text: string;
  onClick?: () => void;
}

export type BreadcrumbProps = {
  crumbs?: Crumb[];
  homeOnClick?: () => void;
  className?: string;
  showDropDown?: boolean;
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
        maxWidth: 100,
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
        padding: `0px ${constants.generalUnit}px 0px 0px`
      },
      menuIcon: {
        width: 12,
        height: 12,
        "& svg": {
          height: 12,
          width: 12
        }
      }
    })
)

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  crumbs = [],
  homeOnClick,
  className,
  showDropDown
}: BreadcrumbProps) => {
  const classes = useStyles()

  const generateFullCrumbs = (crumbs: Crumb[]) => {
    return crumbs.map((item: Crumb, index: number) => (
      <Fragment key={`crumb-${index}`}>
        <div className={clsx(classes.separator)} />
        <div>
          <Typography
            onClick={() => (item.onClick ? item.onClick() : null)}
            className={clsx(classes.crumb, item.onClick && "clickable")}
            variant="body1"
          >
            {item.text}
          </Typography>
        </div>
      </Fragment>
    ))
  }

  const generateDropdownCrumb = (crumbs: Crumb[]) => {
    return (
      <MenuDropdown
        title={crumbs[0].text}
        anchor="bottom-center"
        animation="rotate"
        classNames={{
          item: classes.menuItem,
          title: classes.menuTitle,
          icon: classes.menuIcon,
          titleText: classes.menuTitleText
        }}
        menuItems={crumbs.map((crumb) => ({
          contents: (
            <Typography
              variant="body1"
              onClick={() => (crumb.onClick ? crumb.onClick() : null)}
            >
              {crumb.text}
            </Typography>
          )
        }))}
      />
    )
  }

  const generateCrumbs = () => {
    if (crumbs.length < 3 || !showDropDown) {
      return generateFullCrumbs(crumbs)
    } else {
      const dropdownCrumbs = crumbs.slice(0, length - 1)
      const lastCrumb = crumbs[crumbs.length - 1]
      return (
        <>
          <div className={clsx(classes.separator)} />
          {generateDropdownCrumb(dropdownCrumbs)}
          <div className={clsx(classes.separator)} />
          <div>
            <Typography
              onClick={() => (lastCrumb.onClick ? lastCrumb.onClick() : null)}
              className={clsx(classes.crumb, lastCrumb.onClick && "clickable")}
              variant="body1"
            >
              {lastCrumb.text}
            </Typography>
          </div>
        </>
      )
    }
  }

  return (
    <div className={clsx(classes.root, className)}>
      <HomeIcon
        className={clsx(classes.home, homeOnClick && "clickable")}
        onClick={() => (homeOnClick ? homeOnClick() : null)}
      />
      {generateCrumbs()}
    </div>
  )
}

export default Breadcrumb

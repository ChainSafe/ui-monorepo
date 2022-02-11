
import { MenuDropdown, IMenuItem } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { NonceResponsePermission } from "@chainsafe/files-api-client"
import { t } from "@lingui/macro"
import clsx from "clsx"
import React, { ReactNode, useCallback } from "react"
import { CSFTheme } from "../../../../Themes/types"

const useStyles = makeStyles(
  ({ constants, palette }: CSFTheme) => {
    return createStyles({
      icon: {
        "& svg": {
          fill: constants.header.iconColor
        }
      },
      menuItem: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: constants.header.menuItemTextColor,
        "& svg": {
          width: constants.generalUnit * 2,
          height: constants.generalUnit * 2,
          marginRight: constants.generalUnit,
          fill: palette.additional["gray"][7],
          stroke: palette.additional["gray"][7]
        }
      },
      paddedTitle: {
        paddingRight: constants.generalUnit * 2
      },
      permissionDropdownNoBorder: {
        padding: `0px ${constants.generalUnit * 0.75}px`,
        backgroundColor: palette.additional["gray"][1]
      },
      permissionDropDownBorders: {
        border: `1px solid ${palette.additional["gray"][5]}`,
        width: "inherit",
        marginRight: constants.generalUnit,
        borderRadius: "2px"
      }
    })
  }
)


export interface LinkMenuItems {
  id: NonceResponsePermission
  onClick: () => void
  contents: ReactNode
}

export const readRights = t`view-only`
export const editRights = t`can-edit`
export const translatedPermission = (permission: NonceResponsePermission) => permission === "read" ? readRights : editRights

interface Props {
  onViewPermissionClick?: () => void
  onEditPermissionClick?: () => void
  selectedPermission: NonceResponsePermission
  withBorders: boolean
  injectedClasses: {
    root?: string
    options?: string
    dropdownTitle?: string
  }
  permissions: NonceResponsePermission[]
  testId?: string
}

const PermissionsDropdown = ({
  onViewPermissionClick,
  onEditPermissionClick,
  selectedPermission,
  withBorders,
  permissions,
  injectedClasses,
  testId
}: Props) => {

  const classes = useStyles()

  const getMenuItems = useCallback(() => {
    const menuItems: IMenuItem[] = []
    if (permissions.includes("read")) {
      menuItems.push(
        {
          onClick: onViewPermissionClick,
          contents: (
            <div
              data-testid={`dropdown-${testId}-read`}
              className={classes.menuItem}
            >
              {readRights}
            </div>
          )
        }
      )
    }
    if (permissions.includes("write")) {
      menuItems.push(
        {
          onClick: onEditPermissionClick,
          contents: (
            <div
              data-testid={`dropdown-${testId}-write`}
              className={classes.menuItem}
            >
              {editRights}
            </div>
          )
        }
      )
    }
    return menuItems
  }, [classes.menuItem, onViewPermissionClick, onEditPermissionClick, permissions, testId])


  return (
    <MenuDropdown
      title={(selectedPermission && translatedPermission(selectedPermission)) || ""}
      anchor="bottom-right"
      className={clsx(withBorders
        ? classes.permissionDropDownBorders
        : classes.permissionDropdownNoBorder,
      injectedClasses.root)}
      classNames={{
        icon: classes.icon,
        options: injectedClasses.options,
        title: injectedClasses.dropdownTitle
      }}
      menuItems={getMenuItems()}
      testId={testId}
    />
  )
}

export default PermissionsDropdown

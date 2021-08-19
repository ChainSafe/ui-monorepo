import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { DeleteSvg, formatBytes, MenuDropdown, MoreIcon, TableCell, TableRow, useHistory  } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { Bucket } from "@chainsafe/files-api-client"
import { CSSTheme } from "../../Themes/types"
import { useStorage } from "../../Contexts/StorageContext"
import { desktopGridSettings, mobileGridSettings }  from "../Pages/BucketsPage"
import { ROUTE_LINKS } from "../StorageRoutes"
import clsx from "clsx"

const useStyles = makeStyles(({ animation, constants, breakpoints }: CSSTheme) =>
  createStyles({
    dropdownIcon: {
      "& svg": {
        fill: constants.fileSystemItemRow.dropdownIcon
      }
    },
    dropdownOptions: {
      backgroundColor: constants.fileSystemItemRow.optionsBackground,
      color: constants.fileSystemItemRow.optionsColor,
      border: `1px solid ${constants.fileSystemItemRow.optionsBorder}`
    },
    dropdownItem: {
      backgroundColor: constants.fileSystemItemRow.itemBackground,
      color: constants.fileSystemItemRow.itemColor
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
      "& svg": {
        fill: constants.fileSystemItemRow.menuIcon
      }
    },
    name: {
      textAlign: "left",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      "&.editing": {
        overflow: "visible"
      }
    },
    tableRow: {
      border: "2px solid transparent",
      transitionDuration: `${animation.transform}ms`,
      "&.deleting": {
        // TODO: #1321
        display: "none"
      },
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileGridSettings
      },
      cursor: "pointer"
    }
  })
)
interface Props {
  bucket: Bucket
}

const BucketRow = ({ bucket }: Props) => {
  const classes = useStyles()
  const { removeBucket } = useStorage()
  const { redirect } = useHistory()
  return (
    <TableRow
      type="grid"
      className={clsx(classes.tableRow, {
        deleting: bucket.status === "deleting"
      })}
      data-cy="row-bucket-item"
    >
      <TableCell
        className={classes.name}
        data-cy="cell-bucket-name"
        onClick={() => redirect(ROUTE_LINKS.Bucket(bucket.id, "/"))}>
        {bucket.name || bucket.id}
      </TableCell>
      <TableCell>
        {formatBytes(bucket.size, 2)}
      </TableCell>
      <TableCell align="right">
        <MenuDropdown
          testId='bucket-kebab'
          animation="none"
          anchor={"bottom-right"}
          menuItems={[{
            contents: (
              <>
                <DeleteSvg className={classes.menuIcon} />
                <span data-cy="menu-delete-bucket">
                  <Trans>Delete bucket</Trans>
                </span>
              </>
            ),
            onClick: () => removeBucket(bucket.id)
          }]}
          classNames={{
            icon: classes.dropdownIcon,
            options: classes.dropdownOptions,
            item: classes.dropdownItem
          }}
          indicator={MoreIcon}
        />
      </TableCell>
    </TableRow>
  )
}

export default BucketRow
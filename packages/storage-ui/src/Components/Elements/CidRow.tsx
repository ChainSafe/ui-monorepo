import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { DeleteSvg, formatBytes, MenuDropdown, MoreIcon, TableCell, TableRow  } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { PinObject } from "@chainsafe/files-api-client"
import { CSSTheme } from "../../Themes/types"
import { useStorage } from "../../Contexts/StorageContext"
import { desktopGridSettings, mobileGridSettings } from "../Pages/CidsPage"

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
    cid: {
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
      [breakpoints.up("md")]: {
        gridTemplateColumns: desktopGridSettings
      },
      [breakpoints.down("md")]: {
        gridTemplateColumns: mobileGridSettings
      }
    }
  })
)
interface Props {
    pinObject: PinObject
}

const IPFS_GATEWAY = "https://ipfs.infura.io:5001/api/v0/cat/"

const CidRow = ({ pinObject }: Props) => {
  const classes = useStyles()
  const { unpin } = useStorage()

  console.log("pinObject", pinObject)
  return (
    <TableRow
      type="grid"
      className={classes.tableRow}
    >
      <TableCell className={classes.cid}>
        {pinObject.pin?.cid}
      </TableCell>
      <TableCell>
        {dayjs(pinObject.created).format("DD MMM YYYY h:mm a")}
      </TableCell>
      <TableCell>
        {/** as any needs to be removed when the api spec will be up to date */}
        {formatBytes((pinObject as any).info.size)}
      </TableCell>
      <TableCell>
        <a
          href={`${IPFS_GATEWAY}${pinObject.pin?.cid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Open on Gateway</Trans>
        </a>
      </TableCell>
      <TableCell align="right">
        <MenuDropdown
          testId='fileDropdown'
          animation="none"
          anchor={"bottom-right"}
          menuItems={[{
            contents: (
              <>
                <DeleteSvg className={classes.menuIcon} />
                <span data-cy="menu-share">
                  <Trans>Unpin</Trans>
                </span>
              </>
            ),
            // todo remove when specs are updated
            onClick: () => unpin((pinObject as any).requestid)
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

export default CidRow
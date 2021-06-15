import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { formatBytes, TableCell, TableRow  } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import dayjs from "dayjs"
import { PinObject } from "@chainsafe/files-api-client"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
    }
  })
)
interface Props {
    pinObject: PinObject
}

const IPFS_GATEWAY = "https://ipfs.infura.io:5001/api/v0/cat/"

const PinRow = ({ pinObject }: Props) => {
  const classes = useStyles()

  return (
    <TableRow
      type="grid"
      className={classes.root}
    >
      <TableCell>
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
      <TableCell>

      </TableCell>
    </TableRow>
  )
}

export default PinRow
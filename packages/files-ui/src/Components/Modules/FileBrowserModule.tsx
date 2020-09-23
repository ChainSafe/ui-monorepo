import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React from "react"
import { Button, CheckboxInput, Divider, PlusCircleIcon, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Typography, UploadIcon } from "@chainsafe/common-components"
import { useState } from "react"

/**
 * TODO: Establish height & padding values
 * TODO: position fix + position nav wrappers
 * Content will have padding based on wrappers to ensure system scroll
 */

const useStyles = makeStyles(({
  constants
}: ITheme) =>
  createStyles({
    root: {},
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    controls:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > *": {
        marginLeft: constants.generalUnit
      }
    },
    divider: {
      margin: `${constants.generalUnit * 4.5}px 0`
    },

  }),
)

const MOCKS = [
  {
    name:"Whitepapers",
    cid:"QmWPv9tYYmfER4G22o5i4F2tipqrxNd7gxxWGRniPpy5GE",
    content_type:"application/chainsafe-files-directory",
    size: 0
  },
  {
    name:"Gitcoin Grants",
    cid:"QmWPv5tYYmfER4G22o5i4F2tipqrxNd7gxxWGRniPpy5GE",
    content_type:"application/chainsafe-files-directory",
    size: 0
  },
  {
    name:"EthGlobal.txt",
    cid:"QmWPv9tYYmfER4G22o5i4F2tipqrxNd7gxxWGRniP0y5GE",
    content_type:"text/plain",
    size: 3000000
  },
  {
    name:"Filecoin_spec.md",
    cid:"QmWPv9tYYmfER4G22o5i4F2tipqr1Nd7gxxWGRniPpy5GE",
    content_type:"text/plain",
    size: 200100
  },
  {
    name:"Screenshot-09-11-20.png",
    cid:"QmWev9tYYmfER4G22o5i4F2tipqrxNd7gxxWGRniPpy5GE",
    content_type:"image/jpeg",
    size: 1000000
  },
]

interface IFile {
  name: string
  cid: string
  content_type: String
  size: number
}

const FileBrowserModule: React.FC = () => {
  const classes = useStyles()

  const [items, setItems] = useState<IFile[]>(MOCKS)
  // const { list } = useDrive()
  // useEffect(() => {
  //   const fetch = async () => {
  //     const result = await list({
  //       path: '/',
  //     })
  //     console.log(result)
  //   }
  //   fetch()
  // })

  const [selected, setSelected] = useState<string[]>([])

  const handleSelect = (cid: string) => {
    if (selected.includes(cid)) {
      setSelected(selected.filter((selectedCid: string) => selectedCid !== cid))
    } else {
      setSelected([
        ...selected,
        cid
      ])
    }
  }

  const toggleAll = () => {
    if (selected.length == items.length) {
      setSelected([])
    } else {
      setSelected([
        ...items.map((file: IFile) => file.cid)
      ])
    }
  }

  return (
    <article className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h1" component="h1"> 
          My Files
        </Typography>
        <div className={classes.controls}>
          <Button variant="outline">
            <PlusCircleIcon />
            New folder
          </Button>
          <Button variant="outline">
            <UploadIcon />
            Upload
          </Button>
        </div>
      </header>
      <Divider className={classes.divider} />
      <Table
        fullWidth={true}
        // dense={true}
        striped={true}
        hover={true}
      >
        <TableHead>
          <TableHeadCell>
            <CheckboxInput value={selected.length == items.length} onChange={() => toggleAll()} />
          </TableHeadCell>
          <TableHeadCell
            sortButtons={true}
            onSortChange={() => console.log}
            sortDirection="descend"
          >
            Name
          </TableHeadCell>
          <TableHeadCell
            sortButtons={true}
            onSortChange={() => console.log}
            sortDirection="descend"
          >
            Date uploaded
          </TableHeadCell>
          <TableHeadCell
            sortButtons={true}
            align="left"
            onSortChange={() => console.log}
            sortDirection="descend"
          >
            Size
          </TableHeadCell>
          <TableHeadCell>
            {/* Menu */}
          </TableHeadCell>
        </TableHead>
        <TableBody>
          {
            items.map((file: IFile) => (
              <TableRow
                rowSelectable={true}
                selected={selected.includes(file.cid)}
                onClick={() => console.log}
              >
                <TableCell>
                  <CheckboxInput value={selected.includes(file.cid)} onChange={() => handleSelect(file.cid)} />
                </TableCell>
                <TableCell
                  align="left"
                >
                  movies.mp4
                </TableCell>
                <TableCell
                  align="left"
                >
                  
                </TableCell>
                <TableCell
                  align="left"
                >
                  {
                    file.size
                  }
                </TableCell>
                <TableCell>
                  menu
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </article>
  )
}

export default FileBrowserModule


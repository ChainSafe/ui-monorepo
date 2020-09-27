import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React, { Fragment } from "react"
import { Button, CheckboxInput, DeleteIcon, Divider, DownloadIcon, EditIcon, ExportIcon, FileImageIcon, FilePdfIcon, FileTextIcon, MenuDropdown, MoreIcon, PlusCircleIcon, ShareAltIcon, SortDirection, standardDateFormat, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Typography, UploadIcon } from "@chainsafe/common-components"
import { useState } from "react"
import { useEffect } from "react"
import { useMemo } from "react"

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
    date_uploaded: Date.now(),
    size: 0
  },
  {
    name:"Gitcoin Grants",
    cid:"QmWPv5tYYmfER4G22o5i4F2tipqrxNd7gxxWGRniPpy5GE",
    content_type:"application/chainsafe-files-directory",
    date_uploaded: Date.now(),
    size: 0
  },
  {
    name:"EthGlobal.txt",
    cid:"QmWPv9tYYmfER4G22o5i4F2tipqrxNd7gxxWGRniP0y5GE",
    content_type:"text/plain",
    date_uploaded: Date.now(),
    size: 3000000
  },
  {
    name:"Filecoin_spec.md",
    cid:"QmWPv9tYYmfER4G22o5i4F2tipqr1Nd7gxxWGRniPpy5GE",
    content_type:"text/plain",
    date_uploaded: Date.now(),
    size: 200100
  },
  {
    name:"Screenshot-09-11-20.png",
    cid:"QmWev9tYYmfER4G22o5i4F2tipqrxNd7gxxWGRniPpy5GE",
    content_type:"image/jpeg",
    date_uploaded: Date.now(),
    size: 1000000
  },
]

// TODO Replace with correct interface
interface IFile {
  name: string
  cid: string
  content_type: String
  date_uploaded: number
  size: number
}

export interface IFileBrowserProps {
  heading?: string
  files: IFile[]
}

const FileBrowserModule: React.FC<IFileBrowserProps> = ({
  files = MOCKS,
  heading = "My Files"
}: IFileBrowserProps) => {
  const classes = useStyles()


  const [direction, setDirection] = useState<SortDirection>("ascend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">("name")
 
  const sortFoldersFirst = (a: IFile, b: IFile) => a.content_type == "application/chainsafe-files-directory" && a.content_type !== b.content_type ? -1 : 1
  const items: IFile[] = useMemo(() => {
    switch(direction) {
      default: {
        // case "descend": {
        // case "name": {
        return files.sort((a: IFile, b: IFile) => a.name > b.name ? -1 : 1)
          .sort(sortFoldersFirst)
      }
      case "descend": {
        switch (column) {
          default: {
            // case "name": {
            return files.sort((a: IFile, b: IFile) => a.name > b.name ? -1 : 1)
              .sort(sortFoldersFirst)
          }
          case "size": {
            return files.sort((a: IFile, b: IFile) => a.size > b.size ? -1 : 1)
              .sort(sortFoldersFirst)
          }
          case "date_uploaded": {
            return files.sort((a: IFile, b: IFile) => a.date_uploaded > b.date_uploaded ? -1 : 1)
              .sort(sortFoldersFirst)
          }
        }
      }
      case "ascend": {
        switch (column) {
          default: {
            // case "name": {
            return files.sort((a: IFile, b: IFile) => a.name < b.name ? -1 : 1)
              .sort(sortFoldersFirst)
          }
          case "size": {
            return files.sort((a: IFile, b: IFile) => a.size < b.size ? -1 : 1)
              .sort(sortFoldersFirst)
          }
          case "date_uploaded": {
            return files.sort((a: IFile, b: IFile) => a.date_uploaded < b.date_uploaded ? -1 : 1)
              .sort(sortFoldersFirst)
          }
        }
      }
    }
  }, [files, direction, column])

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

  const sortFilters = (items: IFile[]) => {
    
  }

  const handleSortToggle = (targetColumn: "name" | "size" | "date_uploaded") => {
    if (column != targetColumn) {
      setColumn(targetColumn)
      setDirection("descend")
    } else {
      if (direction == "ascend") {
        setDirection("descend")
      } else {
        setDirection("ascend")
      }
    }
  }

  return (
    <article className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h1" component="h1"> 
          {
            heading
          }
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
          <TableHeadCell>
            {/* 
              Icon
            */}
          </TableHeadCell>
          <TableHeadCell
            sortButtons={true}
            align="left"
            onSortChange={() => handleSortToggle("name")}
            sortDirection={column == "name" ? direction : undefined}
          >
            Name
          </TableHeadCell>
          <TableHeadCell
            sortButtons={true}
            align="left"
            onSortChange={() => handleSortToggle("date_uploaded")}
            sortDirection={column == "date_uploaded" ? direction : undefined}
          >
            Date uploaded
          </TableHeadCell>
          <TableHeadCell
            sortButtons={true}
            align="left"
            onSortChange={() => handleSortToggle("size")}
            sortDirection={column == "size" ? direction : undefined}
          >
            Size
          </TableHeadCell>
          <TableHeadCell>
            {/* Menu */}
          </TableHeadCell>
        </TableHead>
        <TableBody>
          {
            items.map((file: IFile) => {
              let Icon
              if (file.content_type.includes("image")){
                Icon = FileImageIcon
              } else if (file.content_type.includes("pdf")) {
                Icon = FilePdfIcon
              } else {
                Icon = FileTextIcon
              }
              return (
                <TableRow
                  rowSelectable={true}
                  selected={selected.includes(file.cid)}
                  onClick={() => handleSelect(file.cid)}
                >
                  <TableCell>
                    <CheckboxInput value={selected.includes(file.cid)} onChange={() => handleSelect(file.cid)} />
                  </TableCell>
                  <TableCell>
                    <Icon />  
                  </TableCell>
                  <TableCell
                    align="left"
                  >
                    {
                      file.name
                    }
                  </TableCell>
                  <TableCell
                    align="left"
                  >
                    {
                      standardDateFormat(new Date(file.date_uploaded))
                    }
                  </TableCell>
                  <TableCell
                    align="left"
                  >
                    {
                      file.size
                    }
                  </TableCell>
                  <TableCell
                    align="right"
                  >
                    <MenuDropdown 
                      menuItems={[
                        {
                          contents: <Fragment>
                            <ExportIcon />
                            <span>
                              Move
                            </span>
                          </Fragment>,
                          onClick: () => console.log
                        },
                        {
                          contents: <Fragment>
                            <ShareAltIcon />
                            <span>
                              Share
                            </span>
                          </Fragment>,
                          onClick: () => console.log
                        },
                        {
                          contents: <Fragment>
                            <EditIcon />
                            <span>
                              Rename
                            </span>
                          </Fragment>,
                          onClick: () => console.log
                        },
                        {
                          contents: <Fragment>
                            <DeleteIcon />
                            <span>
                              Delete
                            </span>
                          </Fragment>,
                          onClick: () => console.log
                        },
                        {
                          contents: <Fragment>
                            <DownloadIcon/>
                            <span>
                              Download
                            </span>
                          </Fragment>,
                          onClick: () => console.log
                        },
                      ]}
                      indicator={MoreIcon}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </article>
  )
}

export default FileBrowserModule


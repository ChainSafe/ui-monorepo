import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React, { Fragment } from "react"
import {
  Button,
  CheckboxInput,
  DeleteIcon,
  Divider,
  DownloadIcon,
  EditIcon,
  ExportIcon,
  FileImageSvg,
  FilePdfSvg,
  FileTextSvg,
  FolderSvg,
  formatBytes,
  FormikTextInput,
  MenuDropdown,
  MoreIcon,
  ShareAltIcon,
  SortDirection,
  standardlongDateFormat,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Typography,
  UploadIcon,
} from "@chainsafe/common-components"
import { useState } from "react"
import { useMemo } from "react"
import { useDrive, IFile } from "@chainsafe/common-contexts"
import { Formik, Form } from "formik"
import { object, string } from "yup"
import EmptySvg from "../../Media/Empty.svg"
import CreateFolderModule from "./CreateFolderModule"

const useStyles = makeStyles(({ constants, palette }: ITheme) => {
  const gridSettings = "50px 69px 3fr 190px 100px 45px !important"
  return createStyles({
    root: {},
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    controls: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > *": {
        marginLeft: constants.generalUnit,
      },
    },
    divider: {
      margin: `${constants.generalUnit * 4.5}px 0`,
    },
    noFiles: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "25vh",
      "& svg": {
        maxWidth: 180,
        marginBottom: constants.generalUnit * 3,
      },
    },
    tableRow: {
      gridTemplateColumns: gridSettings,
    },
    fileIcon: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      "& svg": {
        width: constants.generalUnit * 2.5,
      },
    },
    renameInput: {
      margin: 0,
      width: "100%",
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
    },
  })
})

export interface IFileBrowserProps {
  heading?: string
  // TODO: once pagination & unique content requests are present, this might change to a passed in function
  controls?: boolean
}

const FileBrowserModule: React.FC<IFileBrowserProps> = ({
  heading = "My Files",
  controls = true,
}: IFileBrowserProps) => {
  const classes = useStyles()
  const {
    list,
    deleteFile,
    downloadFile,
    renameFile,
    currentPath,
    updateCurrentPath,
    pathContents,
  } = useDrive()

  // TODO update to pull from list
  const [editing, setEditing] = useState<string | undefined>()
  const [direction, setDirection] = useState<SortDirection>("descend")
  const [column, setColumn] = useState<"name" | "size" | "date_uploaded">(
    "name",
  )
  const [selected, setSelected] = useState<string[]>([])

  const sortFoldersFirst = (a: IFile, b: IFile) =>
    a.content_type === "application/chainsafe-files-directory" &&
    a.content_type !== b.content_type
      ? -1
      : 1
  const items: IFile[] = useMemo(() => {
    if (!pathContents) return []

    switch (direction) {
      default: {
        // case "descend": {
        // case "name": {
        return pathContents
          .sort((a: IFile, b: IFile) => (a.name > b.name ? -1 : 1))
          .sort(sortFoldersFirst)
      }
      case "descend": {
        switch (column) {
          default: {
            // case "name": {
            return pathContents
              .sort((a: IFile, b: IFile) => (a.name > b.name ? -1 : 1))
              .sort(sortFoldersFirst)
          }
          case "size": {
            return pathContents
              .sort((a: IFile, b: IFile) => (a.size > b.size ? -1 : 1))
              .sort(sortFoldersFirst)
          }
          case "date_uploaded": {
            return pathContents
              .sort((a: IFile, b: IFile) =>
                a.date_uploaded > b.date_uploaded ? -1 : 1,
              )
              .sort(sortFoldersFirst)
          }
        }
      }
      case "ascend": {
        switch (column) {
          default: {
            // case "name": {
            return pathContents
              .sort((a: IFile, b: IFile) => (a.name < b.name ? -1 : 1))
              .sort(sortFoldersFirst)
          }
          case "size": {
            return pathContents
              .sort((a: IFile, b: IFile) => (a.size < b.size ? -1 : 1))
              .sort(sortFoldersFirst)
          }
          case "date_uploaded": {
            return pathContents
              .sort((a: IFile, b: IFile) =>
                a.date_uploaded < b.date_uploaded ? -1 : 1,
              )
              .sort(sortFoldersFirst)
          }
        }
      }
    }
  }, [pathContents, direction, column])

  const handleSelect = (cid: string) => {
    if (selected.includes(cid)) {
      setSelected(selected.filter((selectedCid: string) => selectedCid !== cid))
    } else {
      setSelected([...selected, cid])
    }
  }

  const toggleAll = () => {
    if (selected.length === items.length) {
      setSelected([])
    } else {
      setSelected([...items.map((file: IFile) => file.cid)])
    }
  }

  const handleSortToggle = (
    targetColumn: "name" | "size" | "date_uploaded",
  ) => {
    if (column !== targetColumn) {
      setColumn(targetColumn)
      setDirection("descend")
    } else {
      if (direction === "ascend") {
        setDirection("descend")
      } else {
        setDirection("ascend")
      }
    }
  }

  const handleRename = async (path: string, new_path: string) => {
    // TODO set loading
    await renameFile({
      path: path,
      new_path: new_path,
    })
    setEditing(undefined)
  }

  const RenameSchema = object().shape({
    fileName: string()
      .min(1, "Please enter a file name")
      .max(65, "File name length exceeded")
      .required("File name is required"),
  })

  return (
    <article className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h1" component="h1">
          {heading}
        </Typography>
        <div className={classes.controls}>
          {controls && (
            <Fragment>
              <CreateFolderModule />
              <Button variant="outline">
                <UploadIcon />
                Upload
              </Button>
            </Fragment>
          )}
        </div>
      </header>
      <Divider className={classes.divider} />
      {items.length === 0 ? (
        <section className={classes.noFiles}>
          <EmptySvg />
          <Typography variant="h4" component="h4">
            No files to show
          </Typography>
        </section>
      ) : (
        <Table
          fullWidth={true}
          // dense={true}
          striped={true}
          hover={true}
        >
          <TableHead>
            <TableRow type="grid" className={classes.tableRow}>
              <TableHeadCell>
                <CheckboxInput
                  value={selected.length === items.length}
                  onChange={() => toggleAll()}
                />
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
                sortDirection={column === "name" ? direction : undefined}
                sortActive={column === "name"}
              >
                Name
              </TableHeadCell>
              <TableHeadCell
                sortButtons={true}
                align="left"
                onSortChange={() => handleSortToggle("date_uploaded")}
                sortDirection={
                  column === "date_uploaded" ? direction : undefined
                }
                sortActive={column === "date_uploaded"}
              >
                Date uploaded
              </TableHeadCell>
              <TableHeadCell
                sortButtons={true}
                align="left"
                onSortChange={() => handleSortToggle("size")}
                sortDirection={column === "size" ? direction : undefined}
                sortActive={column === "size"}
              >
                Size
              </TableHeadCell>
              <TableHeadCell>{/* Menu */}</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((file: IFile, index: number) => {
              let Icon
              if (
                file.content_type === "application/chainsafe-files-directory"
              ) {
                Icon = FolderSvg
              } else if (file.content_type.includes("image")) {
                Icon = FileImageSvg
              } else if (file.content_type.includes("pdf")) {
                Icon = FilePdfSvg
              } else {
                Icon = FileTextSvg
              }
              return (
                <TableRow
                  key={`files-${index}`}
                  className={classes.tableRow}
                  type="grid"
                  rowSelectable={true}
                  selected={selected.includes(file.cid)}
                >
                  <TableCell>
                    <CheckboxInput
                      value={selected.includes(file.cid)}
                      onChange={() => handleSelect(file.cid)}
                    />
                  </TableCell>
                  <TableCell
                    className={classes.fileIcon}
                    onClick={() => {
                      file.content_type ===
                        "application/chainsafe-files-directory" &&
                        updateCurrentPath(`${currentPath}${file.name}`)
                    }}
                  >
                    <Icon />
                  </TableCell>
                  <TableCell
                    align="left"
                    onClick={() => {
                      file.content_type ===
                        "application/chainsafe-files-directory" &&
                        updateCurrentPath(`${currentPath}${file.name}`)
                    }}
                  >
                    {editing !== file.cid ? (
                      file.name
                    ) : (
                      <Formik
                        initialValues={{
                          fileName: file.name,
                        }}
                        validationSchema={RenameSchema}
                        onSubmit={(values, actions) => {
                          handleRename(
                            `${currentPath}${file.name}`,
                            `${currentPath}${values.fileName}`,
                          )
                        }}
                      >
                        <Form>
                          <FormikTextInput
                            className={classes.renameInput}
                            name="fileName"
                            inputVariant="minimal"
                            placeholder="Please enter a file name"
                          />
                        </Form>
                      </Formik>
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {standardlongDateFormat(new Date(file.date_uploaded), true)}
                  </TableCell>
                  <TableCell align="left">{formatBytes(file.size)}</TableCell>
                  <TableCell align="right">
                    <MenuDropdown
                      animation="none"
                      menuItems={[
                        {
                          contents: (
                            <Fragment>
                              <ExportIcon className={classes.menuIcon} />
                              <span>Move</span>
                            </Fragment>
                          ),
                          onClick: () => console.log,
                        },
                        {
                          contents: (
                            <Fragment>
                              <ShareAltIcon className={classes.menuIcon} />
                              <span>Share</span>
                            </Fragment>
                          ),
                          onClick: () => console.log,
                        },
                        {
                          contents: (
                            <Fragment>
                              <EditIcon className={classes.menuIcon} />
                              <span>Rename</span>
                            </Fragment>
                          ),
                          onClick: () => setEditing(file.cid),
                        },
                        {
                          contents: (
                            <Fragment>
                              <DeleteIcon className={classes.menuIcon} />
                              <span>Delete</span>
                            </Fragment>
                          ),
                          onClick: () =>
                            deleteFile({
                              paths: [`${currentPath}${file.name}`],
                            }),
                        },
                        {
                          contents: (
                            <Fragment>
                              <DownloadIcon className={classes.menuIcon} />
                              <span>Download</span>
                            </Fragment>
                          ),
                          onClick: () => downloadFile(file.name),
                        },
                      ]}
                      indicator={MoreIcon}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </article>
  )
}

export default FileBrowserModule

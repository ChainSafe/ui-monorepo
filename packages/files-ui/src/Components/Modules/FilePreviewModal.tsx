import React, { Fragment, ReactNode, useEffect } from "react"
import { useState } from "react"
import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@imploy/common-themes"
import { IFile, useDrive } from "../../Contexts/DriveContext"
import MimeMatcher from "mime-matcher"
import {
  Button,
  Grid,
  ArrowLeftIcon,
  ArrowRightIcon,
  Typography,
  MenuDropdown,
  ExportIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  MoreIcon,
  ShareAltIcon,
} from "@imploy/common-components"

const SUPPORTED_FILE_TYPES: Record<string, ReactNode> = {
  "application/pdf": <div>PDF Preview coming soon</div>,
  "image/*": <div>Image Previews coming soon</div>,
  "audio/*": <div>Audio Previews coming soon</div>,
  "video/*": <div>Video Previews coming soon</div>,
  "text/*": <div>Text Previews coming soon</div>,
}

const compatibleFilesMatcher = new MimeMatcher(
  ...Object.keys(SUPPORTED_FILE_TYPES),
)

const useStyles = makeStyles(({ constants, palette }: ITheme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      position: "fixed",
      zIndex: 1,
      left: 0,
      top: 0,
      backgroundColor: "rgba(0,0,0, 0.88)",
      overflowX: "hidden",
    },
    previewModalControls: {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      left: 0,
      top: 0,
      width: 643,
      height: 65,
      backgroundColor: palette.additional["gray"][9],
      color: palette.additional["gray"][3],
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: palette.additional["gray"][8],
    },
    closePreviewButton: {
      marginRight: constants.generalUnit * 2,
      marginLeft: constants.generalUnit * 2,
      fill: palette.additional["gray"][2],
    },
    fileOperationsMenu: {
      fill: palette.additional["gray"][2],
    },
    fileName: {
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    menuIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      marginRight: constants.generalUnit * 1.5,
    },
    previewContainer: {
      height: "100%",
      alignItems: "center",
    },
    prevNextControls: {
      alignItems: "center",
      fill: palette.additional["gray"][5],
      "& > span": {
        backgroundColor: palette.additional["gray"][10],
      },
    },
  }),
)

const FilePreviewModal: React.FC<{
  file?: IFile
  nextFile(): void
  previousFile(): void
  closePreview(): void
}> = ({ file, nextFile, previousFile, closePreview }) => {
  const classes = useStyles()
  const { getFileContent, downloadFile } = useDrive()

  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("sm"))

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [fileContent, setFileContent] = useState<Blob | undefined>(undefined)

  useEffect(() => {
    const getContents = async () => {
      if (!file) return

      setIsLoading(true)
      setError(undefined)
      try {
        const content = await getFileContent(file.name)
        setFileContent(content)
      } catch (error) {
        setError("There was an error getting the preview.")
      }
      setIsLoading(false)
    }

    if (file && compatibleFilesMatcher.match(file?.content_type)) {
      getContents()
    }
  }, [file])

  const PreviewComponent =
    file &&
    file.content_type &&
    fileContent &&
    SUPPORTED_FILE_TYPES[file.content_type]

  return !file ? null : (
    <div className={classes.root}>
      <div className={classes.previewModalControls}>
        <ArrowLeftIcon
          onClick={closePreview}
          className={classes.closePreviewButton}
        />
        <Typography variant="h4" component="h1" className={classes.fileName}>
          {file.name}
        </Typography>
        <MenuDropdown
          animation="none"
          anchor="top-right"
          className={classes.fileOperationsMenu}
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
              onClick: () => console.log,
            },
            {
              contents: (
                <Fragment>
                  <DeleteIcon className={classes.menuIcon} />
                  <span>Delete</span>
                </Fragment>
              ),
              onClick: () => console.log,
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
      </div>
      <Grid
        container
        flexDirection="row"
        alignItems="stretch"
        className={classes.previewContainer}
      >
        {desktop && (
          <Grid
            item
            sm={1}
            md={1}
            lg={1}
            xl={1}
            className={classes.prevNextControls}
          >
            <ArrowLeftIcon />
          </Grid>
        )}
        <Grid item xs={12} sm={10} md={10} lg={10} xl={10} alignItems="center">
          {isLoading && <div>Loading</div>}
          {error && <div>{error}</div>}
          {!isLoading &&
            !error &&
            !compatibleFilesMatcher.match(file?.content_type) && (
              <div>This file is not supported. Would you like to download</div>
            )}
          {!isLoading &&
            !error &&
            compatibleFilesMatcher.match(file?.content_type) &&
            fileContent &&
            PreviewComponent}
        </Grid>
        {desktop && (
          <Grid
            item
            sm={1}
            md={1}
            lg={1}
            xl={1}
            className={classes.prevNextControls}
          >
            <ArrowRightIcon />
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default FilePreviewModal

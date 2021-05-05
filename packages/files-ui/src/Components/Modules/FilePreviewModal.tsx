import React, { useEffect, useRef } from "react"
import { useState } from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { BucketType, FileSystemItem, useDrive } from "../../Contexts/DriveContext"
import MimeMatcher from "./../../Utils/MimeMatcher"
import axios, { CancelTokenSource } from "axios"
import {
  Button,
  Grid,
  ArrowLeftIcon,
  ArrowRightIcon,
  Typography,
  MenuDropdown,
  DownloadSvg,
  MoreIcon,
  CloseCircleIcon,
  ProgressBar
  // ExportIcon,
  // DeleteIcon,
  // EditIcon,
  // ShareAltIcon,
} from "@chainsafe/common-components"
import ImagePreview from "./PreviewRenderers/ImagePreview"
import { useSwipeable } from "react-swipeable"
import PdfPreview from "./PreviewRenderers/PDFPreview"
import VideoPreview from "./PreviewRenderers/VideoPreview"
import AudioPreview from "./PreviewRenderers/AudioPreview"
import TextPreview from "./PreviewRenderers/TextPreview"
import MarkdownPreview from "./PreviewRenderers/MarkdownPreview"
import { useHotkeys } from "react-hotkeys-hook"
import { t, Trans } from "@lingui/macro"
import { CSFTheme } from "../../Themes/types"

export interface IPreviewRendererProps {
  contents: Blob
}

const SUPPORTED_FILE_TYPES: Record<string, React.FC<IPreviewRendererProps>> = {
  "application/pdf": PdfPreview,
  "image/*": ImagePreview,
  "audio/*": AudioPreview,
  "video/*": VideoPreview,
  "text/markdown": MarkdownPreview,
  "text/*": TextPreview
}

const compatibleFilesMatcher = new MimeMatcher(
  Object.keys(SUPPORTED_FILE_TYPES)
)

const useStyles = makeStyles(
  ({ constants, palette, zIndex, breakpoints }: CSFTheme) =>
    createStyles({
      root: {
        height: "100%",
        width: "100%",
        position: "fixed",
        zIndex: zIndex?.layer2,
        left: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0, 0.88)",
        overflowX: "hidden"
      },
      previewModalControls: {
        position: "absolute",
        zIndex: zIndex?.layer3,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        left: 0,
        top: 0,
        width: "100%",
        maxWidth: breakpoints.values["md"] - 200,
        height: constants.generalUnit * 8,
        backgroundColor: constants.previewModal.controlsBackground,
        color: constants.previewModal.controlsColor,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: palette.additional["gray"][8]
      },
      closePreviewButton: {
        marginRight: constants.generalUnit * 2,
        marginLeft: constants.generalUnit * 2,
        fill: constants.previewModal.closeButtonColor,
        cursor: "pointer"
      },
      fileOperationsMenu: {
        fill: constants.previewModal.fileOpsColor
      },
      fileName: {
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: constants.previewModal.fileNameColor
      },
      previewContainer: {
        height: "100%",
        alignItems: "center",
        textAlign: "center"
      },
      prevNext: {
        alignItems: "center"
      },
      prevNextButton: {
        backgroundColor: palette.common.black.main,
        padding: `${constants.generalUnit * 2}px !important`,
        borderRadius: constants.generalUnit * 4
      },
      previewContent: {
        color: constants.previewModal.message,
        fill: constants.previewModal.message,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& p": {
          margin: `${constants.generalUnit}px 0`
        }
      },
      downloadButton: {
        borderColor: palette.additional["gray"][3],
        borderWidth: 1,
        borderStyle: "solid"
      },
      swipeContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center"
      },
      loadingBar: {
        width: 150,
        marginTop: constants.generalUnit
      },
      options: {
        backgroundColor: constants.previewModal.optionsBackground,
        color: constants.previewModal.optionsTextColor,
        border: constants.previewModal.optionsBorder
      },
      menuIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        marginRight: constants.generalUnit * 1.5,
        fill: constants.previewModal.menuItemIconColor
      },
      item: {
        color: constants.previewModal.menuItemTextColor
      }
    })
)

interface Props {
  file: FileSystemItem
  nextFile?: () => void
  previousFile?: () => void
  closePreview: () => void
  path: string
  bucketType: BucketType
}

const FilePreviewModal = ({ file, nextFile, previousFile, closePreview, path, bucketType }: Props) => {
  const classes = useStyles()
  const { getFileContent, downloadFile } = useDrive()
  const { desktop } = useThemeSwitcher()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | undefined>(undefined)
  const [fileContent, setFileContent] = useState<Blob | undefined>(undefined)
  const source = useRef<CancelTokenSource | null>(null)
  const { cid, content_type, name, size } = file || {}

  const handlers = useSwipeable({
    onSwipedLeft: () => previousFile && !isLoading && previousFile(),
    onSwipedRight: () => nextFile && !isLoading && nextFile(),
    delta: 20
  })

  function getSource() {
    if (source.current === null) {
      source.current = axios.CancelToken.source()
    }
    return source.current
  }

  useEffect(() => {
    const getContents = async () => {
      if (!cid || !size) return

      if (source.current) {
        source.current.cancel("Cancelling previous request")
        source.current = null
      }

      const token = getSource().token
      setIsLoading(true)
      setError(undefined)

      try {
        const content = await getFileContent({
          cid,
          cancelToken: token,
          onDownloadProgress: (evt) => {
            setLoadingProgress((evt.loaded / size) * 100)
          },
          file,
          path,
          bucketType
        })

        if (content) {
          setFileContent(content)
        } else {
          setError(t`Decryption failed`)
        }

        source.current = null
        setLoadingProgress(0)

      } catch (error) {
        console.error(error)
        setError(t`There was an error getting the preview.`)
      }

      setIsLoading(false)
    }

    if (content_type && compatibleFilesMatcher.match(content_type)) {
      getContents()
    }
  }, [cid, size, content_type, getFileContent, file, path, bucketType])

  const validRendererMimeType =
    content_type &&
    Object.keys(SUPPORTED_FILE_TYPES).find((type) => {
      const matcher = new MimeMatcher(type)

      return matcher.match(content_type)
    })

  const PreviewComponent =
    content_type &&
    fileContent &&
    validRendererMimeType &&
    SUPPORTED_FILE_TYPES[validRendererMimeType]

  useHotkeys("Esc,Escape", () => {
    if (file) {
      closePreview()
    }
  })

  useHotkeys("Left,ArrowLeft", () => {
    if (file && previousFile) {
      previousFile()
    }
  })

  useHotkeys("Right,ArrowRight", () => {
    if (file && nextFile) {
      nextFile()
    }
  })

  const handleDownload = () => {
    if (!name || !cid) return
    if (fileContent) {
      const link = document.createElement("a")
      link.href = URL.createObjectURL(fileContent)
      link.download = name
      link.click()
      URL.revokeObjectURL(link.href)
    } else {
      downloadFile(file, path, bucketType)
    }
  }

  if (!name || !cid || !content_type) {
    return null
  }

  return (
    <div className={classes.root}>
      <div className={classes.previewModalControls}>
        <ArrowLeftIcon
          onClick={closePreview}
          className={classes.closePreviewButton}
        />
        <Typography
          variant={desktop ? "h4" : "h5"}
          component="h1"
          className={classes.fileName}
        >
          {name}
        </Typography>
        <MenuDropdown
          animation="none"
          anchor="top-right"
          className={classes.fileOperationsMenu}
          classNames={{
            options: classes.options,
            item: classes.item
          }}
          menuItems={[
            // {
            //   contents: (
            //     <>
            //       <ExportIcon className={classes.menuIcon} />
            //       <span>Move</span>
            //     </>
            //   ),
            //   onClick: () => console.log,
            // },
            // {
            //   contents: (
            //     <>
            //       <ShareAltIcon className={classes.menuIcon} />
            //       <span>Share</span>
            //     </>
            //   ),
            //   onClick: () => console.log,
            // },
            // {
            //   contents: (
            //     <>
            //       <EditIcon className={classes.menuIcon} />
            //       <span>Rename</span>
            //     </>
            //   ),
            //   onClick: () => console.log,
            // },
            // {
            //   contents: (
            //     <>
            //       <DeleteIcon className={classes.menuIcon} />
            //       <span>Delete</span>
            //     </>
            //   ),
            //   onClick: () => console.log,
            // },
            {
              contents: (
                <>
                  <DownloadSvg className={classes.menuIcon} />
                  <span>
                    <Trans>Download</Trans>
                  </span>
                </>
              ),
              onClick: handleDownload
            }
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
            className={classes.prevNext}
          >
            {previousFile && (
              <Button onClick={previousFile}
                className={classes.prevNextButton}>
                <ArrowLeftIcon />
              </Button>
            )}
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          lg={10}
          xl={10}
          alignItems="center"
        >
          <div
            {...handlers}
            className={classes.swipeContainer}
          >
            {isLoading && (
              <div className={classes.previewContent}>
                <Typography variant="h1">
                  <Trans>Loading preview</Trans>
                </Typography>
                <ProgressBar
                  progress={loadingProgress}
                  className={classes.loadingBar}
                />
              </div>
            )}
            {error && (
              <div className={classes.previewContent}>
                <CloseCircleIcon fontSize={desktop ? "extraLarge" : "medium"} />
                <Typography
                  component="h2"
                  variant="h1"
                >
                  {error}
                </Typography>
              </div>
            )}
            {!isLoading &&
              !error &&
              !compatibleFilesMatcher.match(content_type) && (
              <div className={classes.previewContent}>
                <CloseCircleIcon
                  fontSize={desktop ? "extraLarge" : "medium"}
                />
                <Typography
                  component="p"
                  variant="h1"
                >
                  <Trans>File format not supported.</Trans>
                </Typography>
                <Button
                  className={classes.downloadButton}
                  variant="outline"
                  onClick={() => downloadFile(file, path, bucketType)}
                >
                  <Trans>Download</Trans>
                </Button>
              </div>
            )}
            {!isLoading &&
              !error &&
              compatibleFilesMatcher.match(content_type) &&
              fileContent &&
              PreviewComponent && <PreviewComponent contents={fileContent} />}
          </div>
        </Grid>
        {desktop && (
          <Grid
            item
            md={1}
            lg={1}
            xl={1}
            className={classes.prevNext}
          >
            {nextFile && (
              <Button
                onClick={nextFile}
                className={classes.prevNextButton}
              >
                <ArrowRightIcon />
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default FilePreviewModal

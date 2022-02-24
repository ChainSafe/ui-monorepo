import React, { useCallback, useEffect, useState } from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { FileSystemItem, useFiles } from "../../Contexts/FilesContext"
import MimeMatcher from "./../../Utils/MimeMatcher"
import {
  Button,
  Grid,
  ArrowLeftIcon,
  ArrowRightIcon,
  Typography,
  CloseCircleIcon,
  ProgressBar,
  DownloadIcon,
  CloseIcon
} from "@chainsafe/common-components"
import ImagePreview from "./PreviewRenderers/ImagePreview"
import { useSwipeable } from "react-swipeable"
import PdfPreview from "./PreviewRenderers/PDFPreview"
import VideoPreview from "./PreviewRenderers/VideoPreview"
import AudioPreview from "./PreviewRenderers/AudioPreview"
import TextPreview from "./PreviewRenderers/TextPreview"
import MarkdownPreview from "./PreviewRenderers/MarkdownPreview"
import { useHotkeys } from "react-hotkeys-hook"
import { Trans } from "@lingui/macro"
import { CSFTheme } from "../../Themes/types"
import { useFileBrowser } from "../../Contexts/FileBrowserContext"
import { useGetFile } from "./FileBrowsers/hooks/useGetFile"
import { useMemo } from "react"
import { getPathWithFile } from "../../Utils/pathUtils"
import { getIconForItem } from "../../Utils/getItemIcon"

export interface IPreviewRendererProps {
  contents: Blob
  contentType?: string
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
  ({ constants, palette, zIndex }: CSFTheme) =>
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
        backgroundColor: "rgba(0,0,0, 0.4)",
        height: constants.generalUnit * 8,
        "& > *":{
          margin: "0px 10px"
        },
        "& > *:first-child": {
          marginLeft: "24px"
        }
      },
      closePreviewButton: {
        marginRight: constants.generalUnit * 2,
        cursor: "pointer",
        "& > * > svg":{
          stroke: constants.previewModal.closeButtonColor
        }
      },
      downloadIcon: {
        fill: constants.previewModal.closeButtonColor
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
      },
      focusVisible: {
        backgroundColor: "transparent !important"
      },
      menuWrapper: {
        color: constants.previewModal.menuItemTextColor
      },
      menuRoot: {
        zIndex: "2000 !important" as any
      },
      fileIcon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
          width: constants.generalUnit * 2.5,
          fill: constants.previewModal.fileNameColor
        }
      }
    })
)

interface Props {
  file: FileSystemItem
  nextFile?: () => void
  previousFile?: () => void
  closePreview: () => void
  filePath: string
}

const FilePreviewModal = ({ file, nextFile, previousFile, closePreview, filePath }: Props) => {
  const classes = useStyles()
  const { downloadFile } = useFiles()
  const [fileContent, setFileContent] = useState<Blob | undefined>()
  const { bucket } = useFileBrowser()
  const { buckets } = useFiles()
  const { desktop } = useThemeSwitcher()
  const { cid, content_type, name } = file || {}
  const { isDownloading, downloadProgress, getFile, error } = useGetFile()

  const handlers = useSwipeable({
    onSwipedLeft: () => previousFile && !isDownloading && previousFile(),
    onSwipedRight: () => nextFile && !isDownloading && nextFile(),
    delta: 20
  })

  const previewRendererKey = useMemo(() => content_type &&
    Object.keys(SUPPORTED_FILE_TYPES).find((type) => {
      const matcher = new MimeMatcher(type)

      return matcher.match(content_type)
    }), [content_type])

  useEffect(() => {
    let bucketId
    // Handle preview in Search where a Bucket is not available, but can be assumed to be a `CSF` bucket
    // as search results can only currently come from there.
    if (!bucket) {
      bucketId = buckets.find(b => b.type === "csf")?.id
    } else {
      bucketId = bucket.id
    }

    setFileContent(undefined)
    if (previewRendererKey) {
      getFile({ file, filePath: getPathWithFile(filePath, file.name), bucketId })
        .then((content) => {
          setFileContent(content)
        })
        .catch(console.error)
    }
  }, [file, filePath, getFile, bucket, buckets, previewRendererKey])

  const Icon = useMemo(() => getIconForItem(file), [file])

  const PreviewComponent =
    !!content_type &&
    !!fileContent &&
    !!previewRendererKey &&
    SUPPORTED_FILE_TYPES[previewRendererKey]

  useHotkeys("Esc,Escape", () => {
    if (file) {
      closePreview()
    }
  })

  useHotkeys("Left,ArrowLeft", () => {
    previousFile && previousFile()
  }, [previousFile])

  useHotkeys("Right,ArrowRight", () => {
    nextFile && nextFile()
  }, [nextFile])

  const handleDownload = useCallback(() => {
    if (!name || !cid || !bucket) return
    if (fileContent) {
      const link = document.createElement("a")
      link.href = URL.createObjectURL(fileContent)
      link.download = name
      link.click()
      URL.revokeObjectURL(link.href)
    } else {
      downloadFile(bucket.id, file, filePath)
    }
  }, [bucket, cid, downloadFile, file, fileContent, filePath, name])

  if (!name || !cid || !content_type) {
    return null
  }

  return (
    <div className={classes.root}>
      <div className={classes.previewModalControls}>
        <Icon className={classes.fileIcon} />
        <Typography
          variant={desktop ? "h4" : "h5"}
          component="h1"
          className={classes.fileName}
          data-cy="label-previewed-file-name"
        >
          {name}
        </Typography>
        <Button
          onClick={handleDownload}
          variant="text"
          data-cy="button-download-previewed-file"
        >
          <DownloadIcon className={classes.downloadIcon}/>
        </Button>
        <Button
          onClick={closePreview}
          variant='text'
          className={classes.closePreviewButton}
          data-cy="button-close-preview"
        >
          <CloseIcon />
        </Button>
      </div>
      <Grid
        container
        flexDirection="row"
        alignItems="stretch"
        className={classes.previewContainer}
        data-cy="modal-container-preview"
      >
        {desktop && (
          <Grid
            item
            md={1}
            lg={1}
            xl={1}
            className={classes.prevNext}
          >
            {previousFile && (
              <Button
                onClick={previousFile}
                className={classes.prevNextButton}
                data-cy="button-view-previous-file"
              >
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
            data-cy="container-content-preview"
          >
            {isDownloading && (
              <div className={classes.previewContent}>
                <Typography variant="h1">
                  <Trans>Loading preview</Trans>
                </Typography>
                <ProgressBar
                  progress={downloadProgress}
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
            {!isDownloading &&
              !error &&
              !compatibleFilesMatcher.match(content_type) && (
              <div className={classes.previewContent}>
                <CloseCircleIcon
                  fontSize={desktop ? "extraLarge" : "medium"}
                />
                <Typography
                  component="p"
                  variant="h1"
                  data-cy="label-unsupported-file-message"
                >
                  <Trans>File format not supported.</Trans>
                </Typography>
                <Button
                  className={classes.downloadButton}
                  variant="outline"
                  onClick={handleDownload}
                  data-cy="button-download-unsupported-file"
                >
                  <Trans>Download</Trans>
                </Button>
              </div>
            )}
            {!isDownloading &&
              !error &&
              compatibleFilesMatcher.match(content_type) &&
              fileContent &&
              PreviewComponent &&
              <PreviewComponent
                contents={fileContent}
                contentType={content_type} />
            }
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
                data-cy="button-view-next-file"
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

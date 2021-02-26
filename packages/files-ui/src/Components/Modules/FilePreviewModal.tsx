import React, { Fragment, useEffect, useRef } from "react"
import { useState } from "react"
import {
  createStyles,
  ITheme,
  makeStyles,
  useThemeSwitcher,
} from "@chainsafe/common-theme"
import { FileSystemItem, useDrive } from "../../Contexts/DriveContext"
import MimeMatcher from "mime-matcher"
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
  ProgressBar,
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
import { useHotkeys } from "react-hotkeys-hook"
import { t, Trans } from "@lingui/macro"
import { UI_COLORS } from "../../Themes/Constants"

export interface IPreviewRendererProps {
  contents: Blob
}

const SUPPORTED_FILE_TYPES: Record<string, React.FC<IPreviewRendererProps>> = {
  "application/pdf": PdfPreview,
  "image/*": ImagePreview,
  "audio/*": AudioPreview,
  "video/*": VideoPreview,
  // "text/*": <div>Text Previews coming soon</div>,
}

const compatibleFilesMatcher = new MimeMatcher(
  ...Object.keys(SUPPORTED_FILE_TYPES),
)

const useStyles = makeStyles(
  ({ constants, palette, zIndex, breakpoints }: ITheme) =>
    createStyles({
      root: {
        height: "100%",
        width: "100%",
        position: "fixed",
        zIndex: zIndex?.layer2,
        left: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0, 0.88)",
        overflowX: "hidden",
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
        maxWidth: breakpoints.values["md"],
        height: constants.generalUnit * 8,
        backgroundColor: (constants as UI_COLORS).previewModal.controlsBackground,
        color: (constants as UI_COLORS).previewModal.controlsColor,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: palette.additional["gray"][8],
      },
      closePreviewButton: {
        marginRight: constants.generalUnit * 2,
        marginLeft: constants.generalUnit * 2,
        fill: (constants as UI_COLORS).previewModal.closeButtonColor,
        cursor: "pointer",
      },
      fileOperationsMenu: {
        fill: (constants as UI_COLORS).previewModal.fileOpsColor,
      },
      fileName: {
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: (constants as UI_COLORS).previewModal.fileNameColor,
      },
      previewContainer: {
        height: "100%",
        alignItems: "center",
        textAlign: "center",
      },
      prevNext: {
        alignItems: "center",
      },
      prevNextButton: {
        backgroundColor: palette.common.black.main,
        padding: `${constants.generalUnit * 2}px !important`,
        borderRadius: constants.generalUnit * 4,
      },
      previewContent: {
        // "TODO: FILL"
        color: palette.additional["gray"][6],
        fill: palette.additional["gray"][6],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& h2": {
          margin: `${constants.generalUnit}px 0`,
        },
      },
      downloadButton: {
        // "TODO: FILL"
        backgroundColor: "rgba(0,0,0, 0.88)",
        color: palette.additional["gray"][3],
        borderColor: palette.additional["gray"][3],
        borderWidth: 1,
        borderStyle: "solid",
      },
      swipeContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      },
      loadingBar: {
        width: 150,
        marginTop: constants.generalUnit,
      },
      options: {
        backgroundColor: (constants as UI_COLORS).previewModal.optionsBackground,
        color: (constants as UI_COLORS).previewModal.optionsTextColor,
        border: (constants as UI_COLORS).previewModal.optionsBorder
      },
      menuIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        marginRight: constants.generalUnit * 1.5,
        fill: (constants as UI_COLORS).previewModal.menuItemIconColor
      },
      item: {
        color: (constants as UI_COLORS).previewModal.menuItemTextColor
      },
    }),
)

const FilePreviewModal: React.FC<{
  file?: FileSystemItem
  nextFile?(): void
  previousFile?(): void
  closePreview(): void
}> = ({ file, nextFile, previousFile, closePreview }) => {
  const classes = useStyles()
  const { getFileContent, downloadFile } = useDrive()

  const { desktop } = useThemeSwitcher()

  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | undefined>(undefined)
  const [fileContent, setFileContent] = useState<Blob | undefined>(undefined)
  const handlers = useSwipeable({
    onSwipedLeft: () => previousFile && !isLoading && previousFile(),
    onSwipedRight: () => nextFile && !isLoading && nextFile(),
    delta: 20,
  })

  const source = useRef<CancelTokenSource | null>(null)

  function getSource() {
    if (source.current === null) {
      source.current = axios.CancelToken.source()
    }
    return source.current
  }

  useEffect(() => {
    const getContents = async () => {
      if (!file) return
      if (isLoading && source.current) {
        source.current.cancel("Cancelling previous request")
        source.current = null
      }
      const token = getSource().token
      setIsLoading(true)
      setError(undefined)
      try {
        const content = await getFileContent(file.cid, token, (evt) => {
          setLoadingProgress((evt.loaded / file.size) * 100)
        })
        if (content) {
          setFileContent(content)
        } else {
          setError(t`Decryption failed`)
        }
        source.current = null
        setLoadingProgress(0)
      } catch (error) {
        if (error) {
          setError(t`There was an error getting the preview.`)
        }
      }
      setIsLoading(false)
    }

    if (file && compatibleFilesMatcher.match(file?.content_type)) {
      getContents()
    }

    return () => {
      source.current && source.current.cancel("Cancelled by user")
    }
    // eslint-disable-next-line
  }, [file, getFileContent])

  const validRendererMimeType =
    file &&
    Object.keys(SUPPORTED_FILE_TYPES).find((type) => {
      const matcher = new MimeMatcher(type)

      return matcher.match(file.content_type)
    })

  const PreviewComponent =
    file &&
    file.content_type &&
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
    if (!file) return
    if (fileContent) {
      const link = document.createElement("a")
      link.href = URL.createObjectURL(fileContent)
      link.download = file.name
      link.click()
      URL.revokeObjectURL(link.href)
    } else {
      downloadFile(file.cid)
    }
  }

  return !file ? null : (
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
          {file.name}
        </Typography>
        <MenuDropdown
          animation="none"
          anchor="top-right"
          className={classes.fileOperationsMenu}
          classNames={{
            options: classes.options,
            item: classes.item,
          }}
          menuItems={[
            // {
            //   contents: (
            //     <Fragment>
            //       <ExportIcon className={classes.menuIcon} />
            //       <span>Move</span>
            //     </Fragment>
            //   ),
            //   onClick: () => console.log,
            // },
            // {
            //   contents: (
            //     <Fragment>
            //       <ShareAltIcon className={classes.menuIcon} />
            //       <span>Share</span>
            //     </Fragment>
            //   ),
            //   onClick: () => console.log,
            // },
            // {
            //   contents: (
            //     <Fragment>
            //       <EditIcon className={classes.menuIcon} />
            //       <span>Rename</span>
            //     </Fragment>
            //   ),
            //   onClick: () => console.log,
            // },
            // {
            //   contents: (
            //     <Fragment>
            //       <DeleteIcon className={classes.menuIcon} />
            //       <span>Delete</span>
            //     </Fragment>
            //   ),
            //   onClick: () => console.log,
            // },
            {
              contents: (
                <Fragment>
                  <DownloadSvg className={classes.menuIcon} />
                  <span>
                    <Trans>Download</Trans>
                  </span>
                </Fragment>
              ),
              onClick: handleDownload,
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
          <Grid item sm={1} md={1} lg={1} xl={1} className={classes.prevNext}>
            {previousFile && (
              <Button onClick={previousFile} className={classes.prevNextButton}>
                <ArrowLeftIcon />
              </Button>
            )}
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={10} lg={10} xl={10} alignItems="center">
          <div {...handlers} className={classes.swipeContainer}>
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
                <Typography component="h2" variant="h1">
                  {error}
                </Typography>
              </div>
            )}
            {!isLoading &&
              !error &&
              !compatibleFilesMatcher.match(file?.content_type) && (
                <div className={classes.previewContent}>
                  <CloseCircleIcon
                    fontSize={desktop ? "extraLarge" : "medium"}
                  />
                  <br />
                  <Typography variant="h1">
                    <Trans>File format not supported.</Trans>
                  </Typography>
                  <br />
                  <Button
                    className={classes.downloadButton}
                    onClick={() => downloadFile(file.cid)}
                  >
                    <Trans>Download</Trans>
                  </Button>
                </div>
              )}
            {!isLoading &&
              !error &&
              compatibleFilesMatcher.match(file?.content_type) &&
              fileContent &&
              PreviewComponent && <PreviewComponent contents={fileContent} />}
          </div>
        </Grid>
        {desktop && (
          <Grid item md={1} lg={1} xl={1} className={classes.prevNext}>
            {nextFile && (
              <Button onClick={nextFile} className={classes.prevNextButton}>
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

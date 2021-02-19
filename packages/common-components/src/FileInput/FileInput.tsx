import React, { useCallback, useState, useEffect, ReactNode } from "react"
import { useField } from "formik"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import { Button } from "../Button"
import { Typography } from "../Typography"
import { PlusIcon, CrossIcon } from "../Icons"
import { ScrollbarWrapper } from "../ScrollbarWrapper"

const useStyles = makeStyles(({ constants, palette, overrides }: ITheme) =>
  createStyles({
    root: {
      "& > div": {
        color: palette.additional["gray"][8],
        padding: constants.generalUnit,
        margin: constants.generalUnit * 4,
        marginBottom: 0,
      },
      marginBottom: "0 !important",
      ...overrides?.FileInput?.root,
    },
    pending: {
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: palette.additional["gray"][8],
      padding: `${constants.generalUnit * 4}px 0 !important`,
      "& svg": {
        fill: palette.additional["gray"][8],
      },
      "& > *:first-child": {
        marginBottom: constants.generalUnit,
      },
      ...overrides?.FileInput?.pending,
    },
    filesDropped: {
      "& > div": {
        textAlign: "start",
      },
      ...overrides?.FileInput?.filesDropped,
    },
    error: {
      color: palette.error.main,
      ...overrides?.FileInput?.error,
    },
    item: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      "& svg": {
        height: "100%",
      },
      "& > *:first-child": {
        marginRight: constants.generalUnit,
      },
      ...overrides?.FileInput?.item,
    },
    itemText: {
      flex: "1 1 0",
    },
    scrollbar: {
      maxHeight: "80vh",
    },
    crossIcon: {
      backgroundColor: palette.primary.hover,
    },
    addFiles: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      margin: "0 !important",
      paddingTop: `${constants.generalUnit}px !important`,
      paddingLeft: `${constants.generalUnit * 10}px !important`,
      paddingRight: `${constants.generalUnit}px !important`,
      paddingBottom: 0,
      cursor: "pointer",
      backgroundColor: palette.additional["gray"][1],
    },
    addFilesText: {
      marginLeft: constants.generalUnit,
    },
  }),
)

interface IFileInputProps extends DropzoneOptions {
  className?: string
  variant?: "dropzone" | "filepicker"
  name: string
  label?: string
  showPreviews?: boolean
  pending?: ReactNode | ReactNode[]
  maxFileSize?: number
  classNames?: {
    pending?: string
    filelist?: string
    error?: string
  }
  onFileNumberChange?: (filesNumber: number) => void
}

const FileInput: React.FC<IFileInputProps> = ({
  className,
  variant = "dropzone",
  showPreviews = false,
  name,
  label,
  pending,
  maxFileSize,
  classNames,
  onFileNumberChange,
  ...props
}: IFileInputProps) => {
  const classes = useStyles()
  const [previews, setPreviews] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [{ value }, meta, helpers] = useField(name)

  useEffect(() => {
    onFileNumberChange && onFileNumberChange(value.length)
  }, [value.length])

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const filtered = acceptedFiles.filter((file) =>
        maxFileSize ? file.size <= maxFileSize : true,
      )
      setErrors([])
      if (showPreviews) {
        setPreviews(
          filtered.map((file: any) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        )
      }
      helpers.setValue([...value, ...filtered])

      if (fileRejections.length > 0) {
        const fileDropRejectionErrors = fileRejections.map((fr) =>
          fr.errors.map((fre) => fre.message),
        )
        setErrors(errors.concat(fileDropRejectionErrors))
      }
    },
    [value],
  )

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    previews.forEach((preview) => URL.revokeObjectURL(preview.preview))
  }, [previews])

  const dropZoneProps = {
    noDrag: variant === "filepicker",
    noClick: variant === "filepicker",
    noKeyboard: variant === "filepicker",
    ...props,
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    ...dropZoneProps,
  })

  const removeItem = (i: number) => {
    const items = value as any[]
    items.splice(i, 1)
    helpers.setValue(items)
  }

  return (
    <div {...getRootProps()} className={clsx(classes.root, className)}>
      <input {...getInputProps()} />
      {variant === "dropzone" ? (
        value?.length === 0 ? (
          <div className={clsx(classes.pending, classNames?.pending)}>
            {pending ? (
              pending
            ) : (
              <>
                <PlusIcon fontSize="large" color="primary" />
                <Typography>Click or drag to upload files</Typography>
              </>
            )}
          </div>
        ) : (
          <div className={clsx(classes.root, classNames?.filelist)}>
            <ScrollbarWrapper className={classes.scrollbar}>
              <ul>
                {value.map((file: any, i: any) => (
                  <li className={classes.item} key={i}>
                    <span className={classes.itemText}>{file.name}</span>
                    <Button
                      className={classes.crossIcon}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(i)
                      }}
                      size="small"
                    >
                      <CrossIcon fontSize="small" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollbarWrapper>
          </div>
        )
      ) : (
        <>
          {value?.length === 0
            ? "No files selected"
            : `${value?.length} file(s) selected`}
          <Button onClick={open} size="small">
            Select
          </Button>
        </>
      )}
      {value?.length !== 0 && (
        <div className={classes.addFiles} onClick={open}>
          <PlusIcon fontSize="small" color="primary" />
          <span className={classes.addFilesText}>Add more files</span>
        </div>
      )}
      {(meta.error || errors.length > 0) && (
        <ul className={classNames?.error}>
          <li className={classes.error}>{meta.error}</li>
          {errors.map((error, i) => (
            <li key={i} className={classes.error}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileInput

export { IFileInputProps }

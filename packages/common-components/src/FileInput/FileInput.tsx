import React, { useCallback, useState, useEffect } from "react"
import { useField } from "formik"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"
import Plus from "../Icons/icons/Plus"
import clsx from "clsx"
import Paperclip from "../Icons/icons/Paperclip"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"
import { Button } from "../Button"
import { Typography } from "../Typography"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      "& > div": {
        color: theme.palette["gray"][8],
        backgroundColor: theme.palette["gray"][3],
        borderWidth: 1,
        borderColor: theme.palette["gray"][5],
        borderStyle: "dashed",
        borderRadius: 2,
        padding: `${theme.constants.generalUnit}px`,
      },
    },
    filesDropped: {
      "& > div": {
        textAlign: "start",
      },
    },
    error: {
      color: theme.palette.error.main,
    },
  }),
)

interface IFileInputProps extends DropzoneOptions {
  className?: string
  variant?: "dropzone" | "filepicker"
  name: string
  label?: string
  showPreviews?: boolean
}

const FileInput: React.FC<IFileInputProps> = ({
  className,
  variant = "dropzone",
  showPreviews = false,
  name,
  label,
  ...props
}: IFileInputProps) => {
  const classes = useStyles()
  const [previews, setPreviews] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [value, meta, helpers] = useField(name)

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setErrors([])
      if (showPreviews) {
        setPreviews(
          acceptedFiles.map((file: any) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        )
      }

      helpers.setValue(acceptedFiles)

      if (fileRejections.length > 0) {
        const fileDropRejectionErrors = fileRejections.map((fr) =>
          fr.errors.map((fre) => fre.message),
        )
        setErrors(errors.concat(fileDropRejectionErrors))
      }
    },
    [],
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

  return (
    <div {...getRootProps()} className={clsx(classes.root, className)}>
      <input {...getInputProps()} />
      {variant === "dropzone" ? (
        value.value?.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <Plus fontSize="large" color="primary" />
            <br />
            <Typography>Upload Files and Folders</Typography>
          </div>
        ) : (
          <div className={clsx(classes.root, className)}>
            <ul>
              {value.value.map((file: any, i: any) => (
                <li key={i}>
                  <Paperclip /> {file.name} - {file.size}
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <>
          {value.value?.length === 0
            ? "No files selected"
            : `${value.value?.length} file(s) selected`}
          <Button onClick={open} size="small">
            Select
          </Button>
        </>
      )}
      {(meta.error || errors.length > 0) && (
        <ul>
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

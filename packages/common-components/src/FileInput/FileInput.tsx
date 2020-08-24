import React, { useCallback, useState, useEffect } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { useField } from "formik"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"
import { ITheme } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    dropzone: {
      "&> *": {
        width: "100%",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
      },
    },
    error: {
      color: theme.palette.error.main,
    },
    // JSS in CSS goes here
  }),
)

interface IFileInputProps extends DropzoneOptions {
  className?: string
  variant?: "dropzone" | "filepicker"
  name: string
  showPreviews?: boolean
}

const FileInput: React.FC<IFileInputProps> = ({
  className,
  variant = "dropzone",
  showPreviews = false,
  name,
  ...props
}: IFileInputProps) => {
  const classes = useStyles()
  const [files, setFiles] = useState<any[]>([])
  //@ts-ignore
  const [value, meta, helpers] = useField(name)

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (showPreviews) {
        setFiles(
          acceptedFiles.map((file: any) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        )
      }

      helpers.setValue(acceptedFiles)

      if (fileRejections.length > 0) {
        helpers.setError("Some files were not accepted")
      }
    },
    [],
  )

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    ...props,
  })

  return (
    <div {...getRootProps()} className={classes.dropzone}>
      <input {...getInputProps()} />
      {value.value?.length === 0 && (
        <p>Click here to open file selection or drag and drop some files</p>
      )}
      {value.value?.length > 0 && (
        <ul>
          {value.value.map((file: any, i: any) => (
            <li key={i}>
              {file.name} - {file.size}
            </li>
          ))}
        </ul>
      )}
      {meta.error && <p className={classes.error}>{meta.error}</p>}
    </div>
  )
}

export default FileInput

export { IFileInputProps }

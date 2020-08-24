import React, { useCallback, useState, useEffect } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { useField } from "formik"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"
import { ITheme } from "@chainsafe/common-themes"
import Plus from "../Icons/icons/Plus"
import Typography from "../Typography"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    dropzone: {
      "&>div": {
        color: "#595959",
        backgroundColor: "#F5F5F5",
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderStyle: "dashed",
        borderRadius: 2,
        textAlign: "center",
        padding: `${theme.constants.generalUnit}px`,
        "&>span>svg": {
          fill: "#8C8C8C",
        },
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
  const [files, setFiles] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
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
        const fileDropRejectionErrors = fileRejections.map(fr =>
          fr.errors.map(fre => fre.message),
        )
        setErrors(errors.concat(fileDropRejectionErrors))
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

  if (variant === "dropzone") {
    return (
      <div {...getRootProps()} className={classes.dropzone}>
        <input {...getInputProps()} />
        {value.value?.length === 0 && (
          <div>
            <Plus fontSize="large" color="primary" />
            <br />
            <Typography>Upload Files and Folders</Typography>
          </div>
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
        {(meta.error || errors.length > 0) && (
          <ul>
            <li className={classes.error}>{meta.error}</li>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        )}
      </div>
    )
  } else {
    return <div></div>
  }
}

export default FileInput

export { IFileInputProps }

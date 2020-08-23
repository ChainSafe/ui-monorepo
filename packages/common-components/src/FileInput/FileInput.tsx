import React, { useCallback, useState, useEffect } from "react"
// import { makeStyles, createStyles } from "@material-ui/styles"
import { useField } from "formik"
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone"

// const useStyles = makeStyles(() =>
//   createStyles({
//     hiddenInput: {
//       display: "none",
//     },
//     // JSS in CSS goes here
//   }),
// )

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
  const [files, setFiles] = useState<any[]>([])
  //@ts-ignore
  const [value, meta, helpers] = useField(name)

  const readAttachment = async (file: File) => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
      reader.onload = function() {
        const resultData = reader.result
        return resolve(resultData)
      }

      reader.onerror = function() {
        return reject(`Oops! Error reading file: ${file.name}`)
      }

      reader.readAsDataURL(file)
    })
  }

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

      const attachments = await Promise.all(
        // `files` is a FileList object - an "array-like" object, like NodeList, so we have to convert to an array before iteration
        acceptedFiles.map(async (file: File) =>
          // We need to retrieve the actual file item from the FilesList
          readAttachment(file),
        ),
      )

      helpers.setValue(attachments)

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
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag and Drop some files here</p>
    </div>
  )
}

export default FileInput

export { IFileInputProps }

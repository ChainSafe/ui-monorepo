import { FileAudioIcon, FileIcon, FileImageIcon, FilePdfIcon, FileTextIcon, FileVideoIcon, FolderIcon } from "@chainsafe/common-components"
import { FileSystemItem } from "../Contexts/FilesContext"
import { matcher } from "./MimeMatcher"

export const getIconForItem = (item: FileSystemItem) => {
  if (item.isFolder) return FolderIcon

  if (matcher(["image/*"])(item.content_type)) return FileImageIcon
  if (matcher(["text/*"])(item.content_type)) return FileTextIcon
  if (matcher(["application/pdf"])(item.content_type)) return FilePdfIcon
  if (matcher(["audio/*"])(item.content_type)) return FileAudioIcon
  if (matcher(["video/*"])(item.content_type)) return FileVideoIcon

  return FileIcon
}

import React from "react"
import { IPreviewRendererProps } from "../FilePreviewModal"

const ImagePreview: React.FC<IPreviewRendererProps> = ({ contents }) => {
  var imageUrl = URL.createObjectURL(contents)
  return (
    <div>
      <img src={imageUrl} alt="" />
    </div>
  )
}

export default ImagePreview

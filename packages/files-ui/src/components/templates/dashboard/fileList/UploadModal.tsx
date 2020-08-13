import React, { useState } from 'react'
import {
  Modal,
  Button,
  Progress,
  Message,
  Space,
  Typography
} from 'src/components/kit'
import { UploadButton } from './UploadButton'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'src/store/store'
import {
  uploadApiAction,
  clearUploadFlagsAction
} from 'src/store/actionCreators'
import styled from 'styled-components'

const FooterContainer = styled.div`
  padding: 1em 0 0 0;
  display: flex;
  justify-content: flex-end;
`

interface IProps {
  open: boolean
  onClose: () => void
}

const UploadModal: React.FC<IProps> = props => {
  const { open, onClose } = props

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const dispatch = useDispatch()

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0])
    }
  }

  const {
    uploadLoading,
    uploadProgress,
    uploadStatus,
    uploadError,
    pathString
  } = useSelector((state: AppState) => state.drive)

  const onModalClose = () => {
    onClose()
    setSelectedFile(null)
    dispatch(clearUploadFlagsAction())
  }

  const onStartUpload = () => {
    // setShowMessage(false);
    if (!selectedFile) {
      return
    }
    const data = new FormData()
    data.append('file', selectedFile)
    data.append('path', pathString)

    dispatch(uploadApiAction(data, pathString))
  }

  return (
    <Modal
      visible={open}
      width={400}
      closable={false}
      footer={null}
      centered={true}
    >
      {uploadStatus === null && !uploadLoading && (
        <UploadButton
          selectedFile={selectedFile}
          handleFileSelect={handleSelectFile}
        />
      )}
      {uploadStatus === null && uploadLoading && (
        <div>
          <Typography>Uploading file</Typography>
          <Progress percent={uploadProgress} status="active" />
        </div>
      )}
      {uploadStatus === true && (
        <div>
          <Typography>File upload complete</Typography>
          <Progress percent={100} />
        </div>
      )}
      {uploadStatus === false && uploadError && (
        <Message type="error" message={uploadError} />
      )}

      <FooterContainer>
        <Space>
          {uploadStatus === null && !uploadLoading && (
            <>
              <Button key="cancel" onClick={onModalClose}>
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                disabled={!selectedFile}
                onClick={onStartUpload}
              >
                Upload
              </Button>
            </>
          )}
          {uploadStatus === true && (
            <>
              <Button key="close" type="primary" onClick={onModalClose}>
                Done
              </Button>
            </>
          )}
          {uploadStatus === false && (
            <>
              <Button key="close" type="primary" onClick={onModalClose}>
                Close
              </Button>
            </>
          )}
        </Space>
      </FooterContainer>
    </Modal>
  )
}

export { UploadModal }

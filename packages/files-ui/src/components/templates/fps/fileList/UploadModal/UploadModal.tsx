import React, { useState } from 'react'
import {
  Modal,
  Button,
  Progress,
  Message,
  Typography,
  Collapse
} from 'src/components/kit'
import { UploadButton } from './UploadButton'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'src/store/store'
import {
  uploadFpsApiAction,
  clearFpsUploadFlagsAction
} from 'src/store/actionCreators'
import { FileRow } from './FileRow'
import { storageParametersValidator } from 'src/validators/fpsValidator'
import { StorageBox } from './StorageBox'
import styled from 'styled-components'

const MyModal = styled(Modal)`
  padding: 0;
  margin: 3em;

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-close {
    right: -50px;
    top: -50px;
    color: white;
  }

  .ant-collapse-content-box {
    padding: 0;
  }
`

const ProgressContainer = styled.div`
  text-align: center;
  width: 100%;
  padding: 3em;
  min-height: 300px;
`

const FileOperationsContainer = styled.div`
  padding: 1.5em;
  text-align: center;
`

const TextContainer = styled.div`
  margin: 1em;
`

interface IProps {
  open: boolean
  onClose: () => void
}

const { Panel } = Collapse

enum PANEL_MODE {
  FILES_PANEL = 'filesPanel',
  DEAL_PANEL = 'dealPanel'
}

const UploadModal: React.FC<IProps> = props => {
  const { open, onClose } = props

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [activePanels, setActivePanels] = useState<PANEL_MODE[]>([
    PANEL_MODE.FILES_PANEL
  ])

  const [storageParameters, setStorageParameters] = useState({
    dealDuration: '',
    replicationFactor: ''
  })

  const [storageParametersErrors, setStorageParametersErrors] = useState({
    dealDuration: '',
    replicationFactor: ''
  })

  const handleStorageParameterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist()
    setStorageParameters(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }))
  }

  const dispatch = useDispatch()

  const handleFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)])
      openFilesPanel()
    }
  }

  const handleRemoveFile = (index: number) => {
    const mySelectedFiles = selectedFiles
    mySelectedFiles.splice(index, 1)
    setSelectedFiles([...mySelectedFiles])
  }

  const openFilesPanel = () => {
    setActivePanels([PANEL_MODE.FILES_PANEL])
  }

  const openStoragePanel = () => {
    if (selectedFiles.length) {
      setActivePanels([PANEL_MODE.DEAL_PANEL])
    }
  }

  const genAddFile = () => (
    <UploadButton
      disabled={!!uploadLoading || uploadStatus !== null}
      handleFilesSelect={handleFilesSelect}
      openFilesPanel={openFilesPanel}
    />
  )

  const {
    uploadLoading,
    uploadProgress,
    uploadStatus,
    uploadError
  } = useSelector((state: AppState) => state.fps)

  const onModalClose = () => {
    onClose()
  }

  const onModalAfterClose = () => {
    setSelectedFiles([])
    dispatch(clearFpsUploadFlagsAction())
    setStorageParameters({
      dealDuration: '',
      replicationFactor: ''
    })
    openFilesPanel()
  }

  const onPanelClick = (key: string | string[]) => {
    if (key instanceof Array) {
      const myKeys = key as PANEL_MODE[]
      setActivePanels([...myKeys])
    } else {
      const myKeys = [key as PANEL_MODE]
      setActivePanels([...myKeys])
    }
  }

  const handleBulkUpload = () => {
    if (selectedFiles.length) {
      const { errors, data, isValid } = storageParametersValidator(
        storageParameters
      )
      setStorageParametersErrors(errors)
      if (!isValid) return

      const filesData = new FormData()
      selectedFiles.forEach(file => {
        filesData.append('file', file)
      })
      filesData.append('replication', data.replicationFactor.toString())
      filesData.append(
        'deal_duration',
        (data.dealDuration * 1440 * 60).toString()
      )

      openStoragePanel()
      dispatch(uploadFpsApiAction(filesData))
    }
  }

  return (
    <MyModal
      visible={open}
      width={600}
      closable={!uploadLoading}
      footer={null}
      centered={true}
      onCancel={onModalClose}
      afterClose={onModalAfterClose}
      maskClosable={false}
    >
      <Collapse activeKey={activePanels} onChange={onPanelClick}>
        <Panel
          header="Select files"
          key={PANEL_MODE.FILES_PANEL}
          extra={genAddFile()}
          disabled={!!uploadLoading || uploadStatus !== null}
        >
          {selectedFiles.map((myFile, index) => (
            <FileRow
              key={index}
              onRemove={() => handleRemoveFile(index)}
              filename={myFile.name}
              size={myFile.size}
            />
          ))}
          <FileOperationsContainer>
            {selectedFiles.length ? (
              <Button type="primary" onClick={openStoragePanel}>
                Select these files
              </Button>
            ) : (
              'No files selected'
            )}
          </FileOperationsContainer>
        </Panel>
        <Panel
          header="Set storage deal parameters"
          key={PANEL_MODE.DEAL_PANEL}
          disabled={
            !selectedFiles.length || !!uploadLoading || uploadStatus !== null
          }
        >
          {uploadStatus === null && !uploadLoading && (
            <StorageBox
              storageParameters={storageParameters}
              storageParametersErrors={storageParametersErrors}
              handleBulkUpload={handleBulkUpload}
              handleStorageParameterChange={handleStorageParameterChange}
            />
          )}
          {uploadStatus === null && uploadLoading && (
            <ProgressContainer>
              <Progress
                percent={uploadProgress}
                status="active"
                type="circle"
              />
              <TextContainer>
                <Typography>Please wait, making storage deal</Typography>
              </TextContainer>
            </ProgressContainer>
          )}
          {uploadStatus === true && (
            <ProgressContainer>
              <Progress percent={100} type="circle" />
              <TextContainer>
                <Typography>Your deal is in progress.</Typography>
                <Typography>It may take some time to complete.</Typography>
              </TextContainer>
              <TextContainer>
                <Button onClick={onModalClose}>Close</Button>
              </TextContainer>
            </ProgressContainer>
          )}
          {uploadStatus === false && uploadError && (
            <ProgressContainer>
              <Progress
                type="circle"
                percent={uploadProgress}
                status="exception"
              />
              <Message type="error" message={uploadError} />
              <TextContainer>
                <Button onClick={onModalClose}>Close</Button>
              </TextContainer>
            </ProgressContainer>
          )}
        </Panel>
      </Collapse>
    </MyModal>
  )
}

export { UploadModal }

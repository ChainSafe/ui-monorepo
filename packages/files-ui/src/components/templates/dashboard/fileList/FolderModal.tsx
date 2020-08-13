import React, { useState } from 'react'
import {
  Modal,
  Input,
  Typography,
  Button,
  Message,
  Space
} from 'src/components/kit'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'src/store/store'
import { mkDirApiAction } from 'src/store/actionCreators'
import styled from 'styled-components'

const BodyContainer = styled.div`
  padding: 2em 1em 1em 1em;
`

const FooterContainer = styled.div`
  padding: 1em 0 0 0;
  display: flex;
  justify-content: flex-end;
`

interface IProps {
  open: boolean
  onClose: () => void
}

const NewFolderModal: React.FC<IProps> = props => {
  const { open, onClose } = props
  const [showMessage, setShowMessage] = useState(false)
  const [folderName, setFolderName] = useState('')
  const { mkdirLoading, mkdirError, pathArray, pathString } = useSelector(
    (state: AppState) => state.drive
  )
  const dispatch = useDispatch()

  const onFolderCreate = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(mkDirApiAction(pathArray, pathString, folderName, onCloseModal))
    setShowMessage(true)
  }

  const onCloseModal = () => {
    onClose()
    setFolderName('')
  }

  return (
    <Modal
      visible={open}
      width={400}
      footer={null}
      onCancel={onCloseModal}
      centered={true}
    >
      <form onSubmit={onFolderCreate}>
        <BodyContainer>
          <Typography>Folder name</Typography>
          <Input
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
            placeholder="Folder name"
          />
          {showMessage && mkdirError && (
            <Message type="error" message={mkdirError} />
          )}
        </BodyContainer>
        <FooterContainer>
          <Space>
            <Button key="cancel" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              key="create"
              type="primary"
              htmlType="submit"
              loading={mkdirLoading}
              onClick={onFolderCreate}
            >
              Create
            </Button>
          </Space>
        </FooterContainer>
      </form>
    </Modal>
  )
}

export { NewFolderModal }

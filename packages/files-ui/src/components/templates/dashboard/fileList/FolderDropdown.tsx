import React, { useState } from 'react'
import {
  Menu,
  Dropdown,
  Modal,
  Button,
  Space,
  Typography
} from 'src/components/kit'
import { EllipsisOutlined } from '@ant-design/icons'
import { deleteFilesApiAction } from 'src/store/actionCreators'
import { useDispatch } from 'react-redux'
import { CloseCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const BodyContainer = styled.div`
  padding: 1em 0.75em 1em 0.75em;
  display: flex;
`

const FooterContainer = styled.div`
  padding: 1em 0 0 0;
  display: flex;
  justify-content: flex-end;
`

const CrossIcon = styled(CloseCircleOutlined)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5em;
  padding: 0em 0.5em 0 0;
`

const Title = styled(Typography)`
  font-weight: bold;
  margin-bottom: 0.5em;
  color: ${({ theme }) => theme.colors.primary};
`

const Description = styled(Typography)`
  color: ${({ theme }) => theme.colors.greyDark};
  font-size: 0.875em;
`

interface IProps {
  folderName: string
  folderIndex: number
  pathString: string
  deleteLoading: boolean
}

const FolderDropdown: React.FC<IProps> = props => {
  const { folderIndex, deleteLoading } = props
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const handleDeleteFile = () => {
    const onSuccess = () => {
      setVisible(false)
      setShowDeleteModal(false)
    }

    dispatch(deleteFilesApiAction([folderIndex], onSuccess, onSuccess))
  }

  const openDelete = () => {
    setVisible(false)
    setShowDeleteModal(true)
  }

  const menu = (
    <Menu>
      <Menu.Item key="2" onClick={openDelete}>
        Delete
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Dropdown
        overlay={menu}
        visible={visible}
        onVisibleChange={visible => setVisible(visible)}
        trigger={['click']}
      >
        <EllipsisOutlined />
      </Dropdown>
      <Modal
        visible={showDeleteModal}
        footer={null}
        closable={false}
        width={420}
        centered={true}
      >
        <BodyContainer>
          <CrossIcon />
          <div>
            <Title>Are you sure you want to delete this item?</Title>
            <Description>The item will be deleted permanently</Description>
          </div>
        </BodyContainer>
        <FooterContainer>
          <Space>
            <Button key="cancel" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              key="delete"
              type="primary"
              loading={deleteLoading}
              onClick={handleDeleteFile}
            >
              Ok
            </Button>
          </Space>
        </FooterContainer>
      </Modal>
    </>
  )
}

export { FolderDropdown }

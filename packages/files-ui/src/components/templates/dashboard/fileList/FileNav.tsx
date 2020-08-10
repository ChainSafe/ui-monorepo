import React, { useState } from 'react'
import { Breadcrumb, Typography, Button } from 'src/components/kit'
import {
  HomeOutlined,
  PlusCircleOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'src/store/store'
import { folderMoveAction } from 'src/store/actionCreators'
import { NewFolderModal } from './FolderModal'
import { UploadModal } from './UploadModal'
import styled from 'styled-components'

interface IPropBreadcrumb {
  folders: string[]
  onSelect: (index: number) => void
}

const BreadcrumbItem = styled(Breadcrumb.Item)`
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const BreadcrumbsNav: React.FC<IPropBreadcrumb> = props => {
  const { folders, onSelect } = props

  return (
    <Breadcrumb>
      {folders.map((folder, index) =>
        folder === '/' ? (
          <BreadcrumbItem key={index} onClick={() => onSelect(index)}>
            <HomeOutlined />
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={index} onClick={() => onSelect(index)}>
            {folder}
          </BreadcrumbItem>
        )
      )}
    </Breadcrumb>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
`

const BreadcrumbBox = styled.div`
  padding: 0.5em 0em;
`

const FlexGrow = styled.div`
  flex: 1;
`

const ButtonContainer = styled.div`
  margin-right: 1em;
`

const FileNav: React.FC = () => {
  const { pathArray } = useSelector((state: AppState) => state.drive)
  const dispatch = useDispatch()

  const onSelectFolder = (index: number) => {
    dispatch(folderMoveAction(index))
  }

  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  return (
    <div>
      <BreadcrumbBox>
        {pathArray.length > 1 ? (
          <BreadcrumbsNav folders={pathArray} onSelect={onSelectFolder} />
        ) : (
          <div style={{ height: 22 }} />
        )}
      </BreadcrumbBox>
      <Container>
        <Typography.Title level={2}>
          {pathArray.length === 1
            ? 'My Files'
            : pathArray[pathArray.length - 1]}
        </Typography.Title>
        <FlexGrow />
        <ButtonContainer>
          <Button
            type="default"
            onClick={() => setNewFolderModalOpen(!newFolderModalOpen)}
          >
            <PlusCircleOutlined />
            New Folder
          </Button>
        </ButtonContainer>
        <Button type="default" onClick={() => setUploadModalOpen(true)}>
          <UploadOutlined />
          Upload File
        </Button>
      </Container>
      <NewFolderModal
        open={newFolderModalOpen}
        onClose={() => setNewFolderModalOpen(false)}
      />
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  )
}

export { FileNav }

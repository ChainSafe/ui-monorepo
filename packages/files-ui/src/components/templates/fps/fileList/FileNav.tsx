import React, { useState } from 'react'
import { Typography, Button } from 'src/components/kit'
import { UploadOutlined } from '@ant-design/icons'
import { UploadModal } from './UploadModal/UploadModal'
import styled from 'styled-components'

interface IPropBreadcrumb {
  folders: string[]
  onSelect: (index: number) => void
}

const Container = styled.div`
  display: flex;
  align-items: center;
`

const FlexGrow = styled.div`
  flex: 1;
`

const FileNav: React.FC = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  return (
    <div>
      <Container>
        <Typography.Title level={2}>{'FPS Files'}</Typography.Title>
        <FlexGrow />
        <Button type="default" onClick={() => setUploadModalOpen(true)}>
          <UploadOutlined />
          Upload File
        </Button>
      </Container>
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  )
}

export { FileNav }

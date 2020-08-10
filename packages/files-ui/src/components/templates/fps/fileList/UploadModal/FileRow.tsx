import React from 'react'
import styled from 'styled-components'
import { Button } from 'src/components/kit'
import { formatFileSizeFromBytes } from 'src/util/helpers'
import { FileOutlined } from '@ant-design/icons'

const RowBox = styled.div`
  display: flex;
  padding: 0.5em 1em;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.greyLight};
`

const NameBox = styled.div`
  width: 50%;
`

const FileIcon = styled(FileOutlined)`
  margin-right: 1.2em;
`

const SizeBox = styled.div`
  width: 25%;
`

const RemoveBox = styled.div`
  width: 25%;
`

interface IProps {
  filename: string
  size: number
  onRemove(): void
}

const FileRow: React.FC<IProps> = ({ filename, size, onRemove }) => {
  return (
    <RowBox>
      <NameBox>
        <FileIcon />
        {filename}
      </NameBox>
      <SizeBox>{formatFileSizeFromBytes(size)}</SizeBox>
      <RemoveBox>
        <Button onClick={onRemove} type="link" size="small">
          Remove
        </Button>
      </RemoveBox>
    </RowBox>
  )
}

export { FileRow }

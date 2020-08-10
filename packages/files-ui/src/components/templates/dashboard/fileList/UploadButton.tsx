import React from 'react'
import styled from 'styled-components'
import { PlusOutlined } from '@ant-design/icons'

interface IProps {
  id?: string
  className?: string
  handleFileSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void
  selectedFile?: File | null
}

const UploadBox = styled.div`
  background-color: ${({ theme }) => theme.colors.greyWhite};
  padding: 2em 2em;
  border: ${({ theme }) => `1px solid ${theme.colors.greyLight}`};
  color: ${({ theme }) => theme.colors.greyDark};
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 350px;
`

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column;
  justify-content: center;
`

const OverflowTextBox = styled.div`
  display: block;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const UploadButton: React.FC<IProps> = props => {
  const { handleFileSelect, selectedFile } = props

  const onUploadClick = () => {
    const myButton = document.getElementById('fileHidden')
    if (myButton) {
      myButton.click()
    }
  }

  return (
    <Container>
      <input
        style={{ display: 'none' }}
        id="fileHidden"
        name="fileHidden"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="fileHidden">
        <UploadBox onClick={onUploadClick}>
          {/* <UploadBox > */}
          {selectedFile ? (
            <OverflowTextBox>{selectedFile.name}</OverflowTextBox>
          ) : (
            <FlexBox>
              <PlusOutlined style={{ fontSize: 32, paddingBottom: 8 }} />
              Upload files
            </FlexBox>
          )}
        </UploadBox>
      </label>
    </Container>
  )
}

export { UploadButton }

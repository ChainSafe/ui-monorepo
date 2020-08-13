import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { FileOutlined } from '@ant-design/icons'
import { Input } from 'src/components/kit'
import {
  renameTempSetAction,
  renameFileApiAction,
  renameCancelAction
} from 'src/store/actionCreators'
import { useDispatch } from 'react-redux'

const OverflowBox = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FileBox = styled(OverflowBox)`
  display: flex;
  align-items: center;
  max-width: 420px;
`

const FileIcon = styled(FileOutlined)`
  margin-right: 1.2em;
`

const RenameInput = styled(Input)`
  padding: 0em 0.5em;
  width: 100%;
  max-width: 420;
`

const FormBox = styled.form`
  width: 100%;
  max-width: 420;
`

interface IProps {
  fileIndex: number
  fileName: string
  tempFileName: string
  renameOpen: boolean
  renameLoading: boolean
}

const FileNameBox: React.FC<IProps> = props => {
  const { fileIndex, fileName, tempFileName, renameOpen, renameLoading } = props
  const dispatch = useDispatch()

  const inputRef = useRef<Input>(null)

  const onHandleRenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(renameTempSetAction(fileIndex, e.target.value))
  }

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(renameFileApiAction(fileIndex))
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (inputRef.current && !inputRef.current.input.contains(event.target)) {
        dispatch(renameCancelAction(fileIndex))
      }
    }

    if (renameOpen && inputRef && inputRef.current) {
      inputRef.current.focus()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef, renameOpen, fileIndex, dispatch])

  return (
    <FileBox>
      <FileIcon />
      {renameOpen ? (
        <FormBox onSubmit={handleRenameSubmit}>
          <RenameInput
            ref={inputRef}
            disabled={renameLoading}
            value={tempFileName}
            onChange={onHandleRenameChange}
          />
        </FormBox>
      ) : (
        <OverflowBox>{fileName}</OverflowBox>
      )}
    </FileBox>
  )
}

export { FileNameBox }

/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { Table } from 'src/components/kit'
import styled from 'styled-components'
import { IDriveFileOrFolderStore } from 'src/types/drive'
import { FolderOutlined } from '@ant-design/icons'
import { formatFileSizeFromBytes } from 'src/util/helpers'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'src/store/store'
import { FileDropdown } from './FileDropdown'
import { FolderDropdown } from './FolderDropdown'
import { onFolderEnter } from 'src/store/actionCreators'
import { FileNameBox } from './FileNameBox'

const Wrapper = styled.div`
  .ant-table-row-selected {
    background: transparent;
  }
`

const FolderIcon = styled(FolderOutlined)`
  margin-right: 1.2em;
`

const NameTitleBox = styled.div`
  margin-left: 2.2em;
`

const OverflowBox = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FolderBox = styled(OverflowBox)`
  cursor: pointer;
`

interface IProps {
  fileList: IDriveFileOrFolderStore[]
}

const FileList: React.FC<IProps> = props => {
  const { fileList } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const { pathString, pathArray } = useSelector(
    (state: AppState) => state.drive
  )
  const dispatch = useDispatch()

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  }

  const moveToFolder = (folderName: string) => {
    dispatch(onFolderEnter(pathArray, pathString, folderName))
  }

  const isDirectory = (record: IDriveFileOrFolderStore) => {
    return record.content_type.includes('file')
  }

  const columns = [
    {
      title: <NameTitleBox>Name</NameTitleBox>,
      dataIndex: 'name',
      render: function(
        text: string,
        record: IDriveFileOrFolderStore,
        index: number
      ) {
        return (
          <>
            {isDirectory(record) ? (
              <FolderBox onClick={() => moveToFolder(text)}>
                <FolderIcon />
                {text}
              </FolderBox>
            ) : (
              <FileNameBox
                fileIndex={index}
                fileName={record.name}
                tempFileName={record.renameTempName}
                renameOpen={record.renameOpen}
                renameLoading={record.renameLoading}
              />
            )}
          </>
        )
      }
    },
    {
      title: 'Last modified',
      dataIndex: 'age',
      width: 150
    },
    {
      title: 'Size',
      dataIndex: 'size',
      width: 120,
      render: function(size: number, record: IDriveFileOrFolderStore) {
        return isDirectory(record) ? '-' : formatFileSizeFromBytes(size)
      }
    },
    {
      title: '',
      dataIndex: '',
      width: 70,
      render: function(
        text: unknown,
        record: IDriveFileOrFolderStore,
        index: number
      ) {
        return isDirectory(record) ? (
          <FolderDropdown
            folderIndex={index}
            deleteLoading={record.deleteLoading}
            folderName={record.name}
            pathString={pathString}
          />
        ) : (
          <FileDropdown
            fileIndex={index}
            deleteLoading={record.deleteLoading}
            filename={record.name}
            pathString={pathString}
          />
        )
      }
    }
  ]

  const tableData = fileList.map((fileOrFolder, index) => {
    return {
      key: index,
      name: fileOrFolder.name,
      size: fileOrFolder.size,
      content_type: fileOrFolder.content_type,
      cid: fileOrFolder.cid,
      deleteLoading: fileOrFolder.deleteLoading,
      downloadLoading: fileOrFolder.downloadLoading,
      renameLoading: fileOrFolder.renameLoading,
      renameOpen: fileOrFolder.renameOpen,
      renameTempName: fileOrFolder.renameTempName
    }
  })

  return (
    <Wrapper>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        style={{ width: '100%' }}
      />
    </Wrapper>
  )
}

export { FileList }

import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Divider, Empty } from 'src/components/kit'
import { FileList } from './fileList/FileList'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'src/store/store'
import {
  getFpsFileListApiAction,
  pollFpsFileListApiAction
} from 'src/store/actionCreators'
import { FileNav } from './fileList/FileNav'

const FileListContainer = styled.div`
  margin-top: 2em;
  margin-bottom: 6em;
  max-width: 900px;
  width: 100%;
`

const NavContainer = styled.div`
  margin-bottom: 1em;
`

const Fps: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getFpsFileListApiAction())

    const pollStatus = setInterval(async () => {
      dispatch(pollFpsFileListApiAction())
    }, 5000)

    return () => {
      clearInterval(pollStatus)
    }
  }, [dispatch])

  const { fileList, fileListLoading } = useSelector(
    (state: AppState) => state.fps
  )

  return (
    <div>
      <NavContainer>
        <FileNav />
      </NavContainer>
      <Divider />
      <FileListContainer>
        {fileListLoading ? (
          'Loading...'
        ) : fileList && fileList.length ? (
          <FileList fileList={fileList} />
        ) : (
          <div>
            <Empty
              style={{ padding: '3em' }}
              imageStyle={{ height: 60 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No files to show"
            />
          </div>
        )}
      </FileListContainer>
    </div>
  )
}

export { Fps }

import React, { useEffect } from 'react'
import { Divider, Empty } from 'src/components/kit'
import { FileList } from './fileList/FileList'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'src/store/store'
import { getFileListApiAction } from 'src/store/actionCreators'
import { FileNav } from './fileList/FileNav'
import { EmailRequestModule } from 'src/components/modules/EmailRequestModule/EmailRequestModule'
import { Redirect } from 'react-router'
import { useLocation } from 'react-router-dom'

const FileListContainer = styled.div`
  margin-top: 2em;
  margin-bottom: 4em;
  max-width: 900px;
  width: 100%;
`

const NavContainer = styled.div`
  margin-bottom: 1em;
`

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getFileListApiAction('/'))
  }, [dispatch])

  const { fileList } = useSelector((state: AppState) => state.drive)

  const query = useQuery()
  const redirectPath = query.get('redirect')

  if (redirectPath) {
    return <Redirect to={redirectPath} />
  }

  return (
    <>
      <NavContainer>
        <FileNav />
      </NavContainer>
      <Divider />
      <FileListContainer>
        {fileList && fileList.length ? (
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
      <EmailRequestModule />
    </>
  )
}

export { Dashboard }

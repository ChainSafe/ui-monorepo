import React from 'react'
import styled from 'styled-components'
import { Typography, Input, Message, Button } from 'src/components/kit'

const StorageContainer = styled.div`
  padding: 2em;
  display: flex;
`

const StorageButtonContainer = styled.div`
  padding: 2em 0 2em 0;
  width: 300px;
`

const FormGroupContainer = styled.div`
  padding: 1em 0;
`

const Caption = styled(Typography)`
  color: ${({ theme }) => theme.colors.greyLight};
  font-size: 0.875em;
`

const AlertBox = styled.div`
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  padding: 0.5em 1em;
  width: 250px;
`

const InputsContainer = styled.div`
  width: 260px;
  padding: 0em 1em;
`

const AlertContainer = styled.div`
  padding: 2em 2em 0 2em;
`

interface IProps {
  storageParameters: {
    dealDuration: string
    replicationFactor: string
  }
  storageParametersErrors: {
    dealDuration: string
    replicationFactor: string
  }
  handleBulkUpload(): void
  handleStorageParameterChange(event: React.ChangeEvent<HTMLInputElement>): void
}

const StorageBox: React.FC<IProps> = ({
  storageParameters,
  handleStorageParameterChange,
  handleBulkUpload,
  storageParametersErrors
}) => {
  return (
    <StorageContainer>
      <InputsContainer>
        <FormGroupContainer>
          <Typography>Deal duration (in days)</Typography>
          <Input
            placeholder="1"
            name="dealDuration"
            value={storageParameters.dealDuration}
            onChange={handleStorageParameterChange}
          />
          <Caption>How long do you want it to be stored?</Caption>
          {storageParametersErrors.dealDuration && (
            <Message
              type="error"
              message={storageParametersErrors.dealDuration}
            />
          )}
        </FormGroupContainer>
        <FormGroupContainer>
          <Typography>Replication factor</Typography>
          <Input
            placeholder="1"
            name="replicationFactor"
            value={storageParameters.replicationFactor}
            onChange={handleStorageParameterChange}
          />
          <Caption>How many copies should be made?</Caption>
          {storageParametersErrors.replicationFactor && (
            <Message
              type="error"
              message={storageParametersErrors.replicationFactor}
            />
          )}
        </FormGroupContainer>
        <StorageButtonContainer>
          <Button type="primary" onClick={handleBulkUpload}>
            Save preferences and upload
          </Button>
        </StorageButtonContainer>
      </InputsContainer>
      <AlertContainer>
        <AlertBox>
          <Typography>
            WARNING: Please keep the Deal Duration and Replication Factor to as
            low as possible since this is a Pre-production Environment
          </Typography>
        </AlertBox>
      </AlertContainer>
    </StorageContainer>
  )
}

export { StorageBox }

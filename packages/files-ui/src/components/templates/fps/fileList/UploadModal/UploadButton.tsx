import React, { useRef } from 'react'
import { Button } from 'src/components/kit'

interface IProps {
  handleFilesSelect(event: React.ChangeEvent<HTMLInputElement>): void
  openFilesPanel(): void
  disabled: boolean
}

const UploadButton: React.FC<IProps> = ({
  handleFilesSelect,
  openFilesPanel,
  disabled
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const onUploadClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()
    event.preventDefault()
    inputRef.current?.click()
    openFilesPanel()
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFilesSelect}
        multiple
      />
      <Button size="small" onClick={onUploadClick} disabled={disabled}>
        Add files
      </Button>
    </>
  )
}

export { UploadButton }

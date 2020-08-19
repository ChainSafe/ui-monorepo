import React, { ReactNode } from "react"

type ButtonProps = {
  children: ReactNode
  disabled?: boolean
  onClick?(): void
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  onClick,
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button

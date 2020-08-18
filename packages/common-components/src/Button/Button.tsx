import React, { ReactNode } from "react"

type ButtonProps = {
  children: ReactNode
  onClick?(): void
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

export default Button

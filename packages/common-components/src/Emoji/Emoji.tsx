import Emoji from "a11y-react-emoji"
import React from "react"

export interface IEmojiProps {
  symbol: string;
  label?: string;
  className?: string;
}

export const EmojiComponent: React.FC<IEmojiProps> = props => {
  return <Emoji {...props} />
}

export default EmojiComponent

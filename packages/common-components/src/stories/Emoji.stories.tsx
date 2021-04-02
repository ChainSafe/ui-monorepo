import React from "react"
import { Emoji, SmileEmoji } from "../Emoji"

export default {
  title: "Emoji",
  component: Emoji,
  excludeStories: /.*Data$/
}

export const SmileEmojiDemo = (): React.ReactNode => <SmileEmoji />

export const CustomEmoji = (): React.ReactNode => <Emoji symbol="🚀" />

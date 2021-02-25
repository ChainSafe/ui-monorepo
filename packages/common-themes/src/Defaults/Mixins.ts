import { MixinConfig } from "../Create/CreateMixins"

const DefaultMixins: MixinConfig = {
  overflowEllipsis: (height: number | string) => ({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    height: typeof height === "number" ? `${height}px` : height
  })
}

export { DefaultMixins }

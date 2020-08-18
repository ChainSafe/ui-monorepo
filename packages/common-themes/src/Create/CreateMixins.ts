const DefaultMixins = {
  overflowEllipsis: (height: number | string) => ({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: typeof height === 'number' ? `${height}px` : height
  })
}

const CreateMixins = (additionalMixins?: MixinConfig): MixinConfig => {
  // No transforms required yet
  return {
    ...DefaultMixins,
    additionalMixins
  }
}

export { CreateMixins, DefaultMixins }

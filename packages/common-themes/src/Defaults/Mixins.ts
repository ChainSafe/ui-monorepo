const DefaultMixins = {
  overflowEllipsis: (height: number | string) => ({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: typeof height === 'number' ? `${height}px` : height
  })
}

export { DefaultMixins }

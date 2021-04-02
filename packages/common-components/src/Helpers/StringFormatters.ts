export const formatBytes = (
  sizeInBytes: number,
  base: 2 | 10 = 10,
  decimals = 2
) => {
  if (0 === sizeInBytes) return "0 Bytes"
  const c = 0 > decimals ? 0 : decimals
  const units = base === 2 ? 1024 : 1000
  const suffixes =
    base === 2
      ? ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
      : ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const d = Math.floor(Math.log(sizeInBytes) / Math.log(units))
  return (
    parseFloat((sizeInBytes / Math.pow(units, d)).toFixed(c)) +
    " " +
    suffixes[d]
  )
}

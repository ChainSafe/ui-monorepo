export const shortenAddress = (address: string, remaining: number = 6) => {
  return `${address.substr(0, remaining)}...${address.substr(
    address.length - remaining,
    remaining,
  )}`
}

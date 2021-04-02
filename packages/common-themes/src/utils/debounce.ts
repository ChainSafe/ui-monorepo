export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitForMs: number
) => {
  let timeout: any = 0

  const debounced = (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitForMs)
  }

  return (debounced as unknown) as (...args: Parameters<F>) => ReturnType<F>
}

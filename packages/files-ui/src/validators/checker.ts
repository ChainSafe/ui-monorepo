export function isEmpty(errors: any): boolean {
  let flag = true
  Object.keys(errors).forEach((key: string) => {
    if (errors[key]) {
      flag = false
    }
  })
  return flag
}

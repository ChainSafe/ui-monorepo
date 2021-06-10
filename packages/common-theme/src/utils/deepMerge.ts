export const isObject = (item: any) => {
  return item && typeof item === "object" && !Array.isArray(item)
}

export const mergeDeep = (target: Record<any, any>, source: Record<any, any>) => {
  const output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = mergeDeep(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

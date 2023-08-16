export const keysEnum = (e: Record<string, any>) => {
  return Object.keys(e).filter((key) => isNaN(parseInt(key)))
}

export const valuesEnum = (e: Record<string, any>) => {
  const keys = Object.keys(e).filter((key) => isNaN(parseInt(key)))
  return keys.map((key) => e[key])
}

export const getKeyEnumByValue = (e: Record<string, any>, value: any) => {
  return Object.keys(e)[Object.values(e).indexOf(value)]
}

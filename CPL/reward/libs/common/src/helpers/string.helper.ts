export const snakeCaseToCamelCase = (input: string) => {
  if (!input) return ''
  return input.replace(/(_\w)/g, (k) => k[1].toUpperCase())
}

export const camelCaseToSnakeCase = (input: string) => {
  if (!input) return ''
  return input.replace(/[A-Z]/g, (k) => `_${k.toLowerCase()}`)
}

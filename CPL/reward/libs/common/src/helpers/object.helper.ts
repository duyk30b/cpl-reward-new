export const stripNullObject = (object: any) => {
  if (!object || typeof object !== 'object' || Array.isArray(object) || object instanceof Date) {
    return object
  }
  Object.entries(object).forEach(([key, value]) => {
    if (value == null) delete object[key]
    else object[key] = stripNullObject(value)
  })
  return object
}

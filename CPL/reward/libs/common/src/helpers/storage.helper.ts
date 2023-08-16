import * as fs from 'fs'

export function touchFile(filePath: string) {
  const time = new Date()
  try {
    fs.utimesSync(filePath, time, time)
  } catch (err) {
    fs.closeSync(fs.openSync(filePath, 'w'))
  }
}

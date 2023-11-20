import { join } from 'path'

export function getProtoPath(protoFile: string) {
  return join(__dirname, 'proto', protoFile)
}

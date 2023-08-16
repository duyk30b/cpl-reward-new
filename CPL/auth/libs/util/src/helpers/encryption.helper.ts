import global_config from 'config/global_config'
import {
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
} from 'crypto'

/*
 * Hàm mã hóa random ra 18 kí tự để nối vào đầu chuỗi cần encrypt, đồng thời cắt 16 trong 18 ký tự đầu để làm IV
 */
export async function encryptOtpSecret(textToEncrypt: string): Promise<string> {
  try {
    const iv = randomBytes(9).toString('hex')
    const key = createHash('sha256')
      .update(global_config().aes_password)
      .digest()
    const cipher = createCipheriv('aes-256-cbc', key, iv.slice(0, 16))

    return (
      iv +
      cipher.update(textToEncrypt, 'utf8', 'base64') +
      cipher.final('base64')
    )
  } catch (e) {
    return ''
  }
}

export function decryptOtpSecret(encryptedText: string) {
  try {
    const iv = encryptedText.slice(0, 16)
    encryptedText = encryptedText.slice(18)

    const key = createHash('sha256')
      .update(global_config().aes_password)
      .digest()
    const cipher = createDecipheriv('aes-256-cbc', key, iv)

    return (
      cipher.update(Buffer.from(encryptedText, 'base64')) +
      cipher.final('base64')
    )
  } catch (e) {
    return ''
  }
}

export function encryptUserPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(salt + password)
    .digest()
    .toString('base64')
}

export function encryptBcePassword(password: string) {
  const plain = password + global_config().bitcastle_encryption_key
  return createHash('sha1').update(plain).digest().toString('hex')
}

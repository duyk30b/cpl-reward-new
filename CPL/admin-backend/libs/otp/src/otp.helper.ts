import { authenticator } from 'otplib'

export function generateAuthenticatorSecret() {
  return authenticator.generateSecret()
}

export function generateAuthenticatorOtp(secret) {
  return authenticator.generate(secret)
}

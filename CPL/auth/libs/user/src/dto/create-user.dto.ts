export interface ICreateUserDto {
  phone?: string
  phoneCountry?: string
  email?: string
  fbId?: string
  ggId?: string
  appleId?: string
  password?: string
  otpSecret?: string
  referrer?: string
  referrerChannel?: string
}

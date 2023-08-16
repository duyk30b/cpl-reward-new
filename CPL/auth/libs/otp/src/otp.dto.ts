import { Expose } from 'class-transformer'

export class OtpResponseDto {
  @Expose()
  success: boolean

  @Expose({ name: 'can_resend_in' })
  canResendIn: number

  constructor(success: boolean, timeBlockResend: number) {
    this.success = success
    this.canResendIn = timeBlockResend
  }
}

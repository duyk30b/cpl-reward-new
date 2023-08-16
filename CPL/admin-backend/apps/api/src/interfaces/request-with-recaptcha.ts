import { Request } from 'express'
export interface IRequestWithRecaptcha extends Request {
  body: {
    recaptcha: string
  }
}

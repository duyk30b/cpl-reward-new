export interface ISendMailRequest {
  userIds?: string[]
  emails?: string[]
  data: string
  mailCommand: {
    template: {
      subject: string
      file: string
    }
    lang?: string
  }
}

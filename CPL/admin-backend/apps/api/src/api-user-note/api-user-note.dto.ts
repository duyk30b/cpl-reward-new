import { ValidationError } from '@lib/util'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateUserNoteDto {
  @Expose()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  note: string
}

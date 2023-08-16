import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserNote } from './user-note.entity'
import { UserNoteService } from './user-note.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserNote])],
  providers: [UserNoteService],
  exports: [UserNoteService],
})
export class UserNoteModule {}

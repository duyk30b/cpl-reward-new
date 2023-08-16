import { Module } from '@nestjs/common'
import { ApiUserNoteService } from './api-user-note.service'
import { ApiUserNoteController } from './api-user-note.controller'
import { UserNoteModule } from '@lib/user-note'
import { AdminModule } from '@lib/admin'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [UserNoteModule, AdminModule, AbilityModule],
  controllers: [ApiUserNoteController],
  providers: [ApiUserNoteService],
})
export class ApiUserNoteModule {}

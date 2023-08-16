import { Module } from '@nestjs/common'
import { AresService } from './ares.service'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import cynopsis from '../../../config/cynopsis'

@Module({
  imports: [ConfigModule.forRoot({ load: [cynopsis] }), HttpModule],
  providers: [AresService],
  exports: [AresService],
})
export class AresModule {}

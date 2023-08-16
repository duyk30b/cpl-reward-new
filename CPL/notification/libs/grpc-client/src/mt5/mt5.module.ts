import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import mt5Config from './mt5.config'
import { Mt5Service } from './mt5.service'

@Module({
  imports: [ConfigModule.forFeature(mt5Config)],
  providers: [Mt5Service],
  exports: [Mt5Service],
})
export class Mt5Module {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserProvider } from './entities/user-provider.entity'
import { UserProviderService } from './user-provider.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserProvider])],
  providers: [UserProviderService],
  exports: [UserProviderService],
})
export class UserProviderModule {}

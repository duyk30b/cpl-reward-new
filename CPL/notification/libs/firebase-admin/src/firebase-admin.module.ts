import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import firebaseAdminConfig from './firebase-admin.config'
import { FirebaseAdminService } from './firebase-admin.service'

@Module({
  imports: [ConfigModule.forFeature(firebaseAdminConfig)],
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}

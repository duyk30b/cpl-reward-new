import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import firebaseConfig from './firebase.config'
import { FirebaseService } from './firebase.service'

@Module({
  imports: [ConfigModule.forFeature(firebaseConfig), HttpModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}

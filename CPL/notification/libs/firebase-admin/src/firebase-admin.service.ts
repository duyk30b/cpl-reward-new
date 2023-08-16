import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import admin from 'firebase-admin'
import { join } from 'path'

@Injectable()
export class FirebaseAdminService {
  private readonly logger = new Logger(FirebaseAdminService.name)
  constructor(private readonly configService: ConfigService) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          join(
            process.cwd(),
            this.configService.get('firebase_admin.credential_path'),
          ),
        ),
      })
    } catch (e) {
      this.logger.error(e, e.stack)
    }
  }
}

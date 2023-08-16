import { HttpException, HttpStatus } from '@nestjs/common'
import { parseDeviceInfo } from '@lib/util'
import { Request, Response, NextFunction } from 'express'
import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { DeviceInfoDto } from '@lib/device/dto/device.dto'

const excludePaths = [
  '/verify-email-by-link',
  '/document',
  '/health',
  '/auth-emqx',
]
export function deviceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Exclude path from middleware
  for (let i = 0; i < excludePaths.length; i++) {
    if (req.path.startsWith(excludePaths[i])) {
      next()
      return
    }
  }

  // Remove fake deviceInfo on headers (if existing). We will decrypt 'headers.device' to get deviceInfo
  if (req.headers && req.headers.device_hash) {
    req.headers.device_hash = null
  }

  // Read decrypted device info on header
  const deviceHeader = req.header('device')
  if (!deviceHeader) {
    throw new HttpException('Invalid device info!', HttpStatus.BAD_REQUEST)
  }

  // Decode device info from request
  try {
    const deviceInfo = plainToClass(
      DeviceInfoDto,
      parseDeviceInfo(deviceHeader),
    )

    const errors = validateSync(deviceInfo)

    if (!deviceInfo || errors.length) {
      throw new HttpException('Invalid device info!', HttpStatus.BAD_REQUEST)
    }

    req.headers.device_hash = deviceInfo.visitorId
  } catch (e) {
    throw new HttpException('Invalid device info', HttpStatus.BAD_REQUEST)
  }

  next()
}

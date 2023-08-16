import { Injectable, Logger } from '@nestjs/common'
import { MqttClient } from '@nestjs/microservices/external/mqtt-client.interface'
import * as mqtt from 'mqtt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name)
  private ws: MqttClient

  constructor(private configService: ConfigService) {
    const { ws, host, port } = this.configService.get('websocket')
    const wsUrl = `${ws}://${host}:${port}/mqtt`

    this.ws = mqtt
      .connect(wsUrl)
      .on('connect', () => {
        this.logger.log(`Connect success to mqtt ${wsUrl} `)
      })
      .on('error', (error) => {
        // this.logger.error(error)
      })
  }

  publish(channel: string, payload: Record<string, unknown>) {
    const topic = this.configService.get('websocket.topic') + '_' + channel

    this.ws.publish(topic, JSON.stringify(payload), (err) => {
      if (err) {
        this.logger.log(err)
      }
    })
  }
}

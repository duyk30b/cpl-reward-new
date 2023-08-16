import CONFIG from '@/config'
import socketMqtt from 'mqtt'

interface ISocket {
  mqtt: socketMqtt.MqttClient | undefined
  connectMqtt: () => socketMqtt.MqttClient
  disconnectMqtt: () => void
}

const socket: ISocket = {
  mqtt: undefined,

  connectMqtt() {
    this.mqtt = socketMqtt.connect(CONFIG.SOCKET_MQTT_URL, {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 4000,
    })
    return this.mqtt
  },

  disconnectMqtt() {
    this.mqtt?.removeAllListeners()
    this.mqtt?.end(true)
    this.mqtt = undefined
  },
}

export function onUpdateOrderSocket(callback: (data: any) => void) {
  // TODO: Miss precision
  if (!socket.mqtt) {
    socket.connectMqtt()
  }
  const topicName = `${CONFIG.UPDATE_ORDER_TOPIC}`
  socket.mqtt?.subscribe(topicName, { qos: 0 })

  socket.mqtt?.on('message', (topic: string, message: string) => {
    try {
      const response: any = JSON.parse(message.toString())
      callback(response)
    } catch (error) {
      console.log(error)
    }
  })

  const unsubscribeEvent = () => {
    socket.mqtt?.unsubscribe(topicName)
  }

  return {
    resubscribe: () => {
      socket.mqtt?.subscribe(topicName, { qos: 0 })
    },
    unsubscribe: () => {
      unsubscribeEvent()
    },
  }
}

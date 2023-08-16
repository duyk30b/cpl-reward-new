import socketMqtt from 'mqtt'

interface ISocket {
  mqtt: socketMqtt.MqttClient | undefined
  connectMqtt: () => socketMqtt.MqttClient
  disconnectMqtt: () => void
}

const connection = {
  host: 'broker.emqx.io',
  port: 8083,
  endpoint: '/mqtt',
  clean: true, // Reserved session
  connectTimeout: 4000, // Time out
  reconnectPeriod: 4000, // Reconnection interval
  // Certification Information
  clientId: 'mqttjs_3be2c321',
  username: 'emqx_test',
  password: 'emqx_test',
}

const { host, port, endpoint, ...options } = connection

const socket: ISocket = {
  mqtt: undefined,

  connectMqtt() {
    this.mqtt = socketMqtt.connect(`ws://${host}:${port}${endpoint}`, options)
    return this.mqtt
  },

  disconnectMqtt() {
    this.mqtt?.removeAllListeners()
    this.mqtt?.end(true)
    this.mqtt = undefined
  },
}

export default socket

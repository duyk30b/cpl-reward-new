import socket from './socket'

export interface IAuthResponse {
  event: string
  userId: string
}

export function onExportSocket(
  topicName: string,
  callback: (str: string) => void,
) {
  if (!socket.mqtt) {
    socket.connectMqtt()
  }

  socket.mqtt?.subscribe(topicName, { qos: 0 }, (error, res) => {
    if (error) {
      console.log('Subscribe to topics error', error)
      return
    }
    console.log('Subscribe to topics res', res)
  })

  socket.mqtt?.on('connect', () => {
    console.log('Connection succeeded!')
  })

  socket.mqtt?.on('message', (topic: string, message: string) => {
    try {
      const response: string = JSON.parse(message.toString())
      if (topic === topicName) {
        callback(response)
      }
    } catch (error) {
      return error
    }
  })

  const unsubscribeEvent = () => {
    socket.mqtt?.unsubscribe(topicName)
  }

  return {
    resubscribe: () => {
      topicName = 'mqtt://test.mosquitto.org'
      socket.mqtt?.subscribe(topicName, { qos: 0 })
    },
    unsubscribe: () => {
      unsubscribeEvent()
    },
  }
}

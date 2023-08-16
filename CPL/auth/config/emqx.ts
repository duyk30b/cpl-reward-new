export default () => ({
  emqx: {
    ws: process.env.EMQX_WS || 'wss',
    host: process.env.EMQX_HOST || 'localhost',
    port: process.env.EMQX_PORT || 8083,
    topic: process.env.ENV + '_auth' || 'dev_auth',
  },
  emqx_list_ip_pub: process.env.EMQX_LIST_IP_PUB || '172.0,127.0,10.0',
})

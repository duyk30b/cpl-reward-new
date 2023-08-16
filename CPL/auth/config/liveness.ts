export default () => ({
  liveness: {
    url: process.env.LIVENESS_URL,
    lib_zoom_url:
      process.env.LIVENESS_LIB_ZOOM_URL ||
      'https://d1.cynopsis.co/service/get_client_license',
    client_id: process.env.LIVENESS_CLIENT_ID,
    secret: process.env.LIVENESS_SECRET,
  },
})

export default () => ({
  iss: process.env.JWT_ISS || 'bitcastle.io',
  authorization_jwt_secret:
    process.env.AUTHORIZATION_JWT_SECRET || '!extremely-secret',
  jwt_key_dir: 'jwt_key',
  access_jwt_public_key: process.env.ACCESS_JWT_PUBLIC_KEY,
  access_jwt_private_key: process.env.ACCESS_JWT_PRIVATE_KEY,
  access_jwt_exp: parseInt(process.env.ACCESS_JWT_EXP) || 180,
  refresh_jwt_public_key: process.env.REFRESH_JWT_PUBLIC_KEY,
  refresh_jwt_private_key: process.env.REFRESH_JWT_PRIVATE_KEY,
  refresh_jwt_exp: parseInt(process.env.REFRESH_JWT_EXP) || 604800,
})

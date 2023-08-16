export enum UserEvent {
  LOGIN = 'user.login',
  LOGOUT = 'user.logout',
  CREATED = 'user.created',
  VERIFIED = 'user.verified',
  CHANGE_PASSWORD = 'user.change_password',
  CHANGE_EMAIL = 'user.change_email',
  AUTHENTICATOR_STATUS_UPDATED = 'user.authenticator_status_updated',
  CHANGE_INFO = 'user.change_info',
  CHANGE_LV = 'user.change_lv',
  PROACTIVELY_LOGOUT = 'user.proactively_logout',
  BAN = 'user.ban',
  UNBAN = 'user.unban',
  CHECK_EMAIL = 'user.check_email',
  DELETE_ACCOUNT = 'user.delete_account',
  REQUEST_DELETE_ACCOUNT = 'user.request_delete_account',
}

export enum UserKycEvent {
  REGISTERED = 'user_kyc.registered',
  STATUS_UPDATED = 'user_kyc.status_updated',
  AUTO_KYC_FINISHED = 'user_kyc.auto_kyc_finished',
}

export enum SocketEvent {
  USER_UPDATED = 'user.updated',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
}

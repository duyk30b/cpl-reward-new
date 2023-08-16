export default () => ({
  event: {
    user: {
      login: process.env.KAFKA_USER_LOGIN_EVENT || 'auth_user_login',
      logout: process.env.KAFKA_USER_LOGOUT_EVENT || 'auth_user_logout',
      created: process.env.KAFKA_USER_CREATED_EVENT || 'auth_user_created',
      change_password:
        process.env.KAFKA_USER_CHANGE_PASSWORD_EVENT ||
        'auth_user_change_password',
      change_email:
        process.env.KAFKA_USER_CHANGE_EMAIL_EVENT || 'auth_user_change_email',
      authenticator_status_updated:
        process.env.KAFKA_USER_AUTHENTICATOR_STATUS_UPDATED_EVENT ||
        'auth_user_authenticator_status_updated',
      change_info:
        process.env.KAFKA_USER_CHANGE_INFO_EVENT || 'auth_user_change_info',
      change_lv:
        process.env.KAFKA_USER_CHANGE_LV_EVENT || 'auth_user_change_lv',
      ban: process.env.KAFKA_USER_BAN_EVENT || 'auth_user_ban',
      unban: process.env.KAFKA_USER_UNBAN_EVENT || 'auth_user_unban',
      delete_account:
        process.env.KAFKA_USER_DELETE_ACCOUNT_EVENT ||
        'auth_user_delete_account',
      request_delete_account:
        process.env.KAFKA_USER_REQUEST_DELETE_ACCOUNT_EVENT ||
        'auth_user_request_delete_account',
    },
    user_kyc: {
      registered:
        process.env.KAFKA_USER_KYC_REGISTERED_EVENT ||
        'auth_user_kyc_registered',
      status_updated:
        process.env.KAFKA_USER_KYC_STATUS_UPDATED_EVENT ||
        'auth_user_kyc_status_updated',
      auto_kyc_finished:
        process.env.KAFKA_USER_KYC_AUTO_KYC_FINISHED_EVENT ||
        'auth_user_kyc_auto_kyc_finished',
    },
  },
})

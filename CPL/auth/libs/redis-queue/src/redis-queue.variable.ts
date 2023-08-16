export const USER_QUEUE = 'auth:user'
export const KYC_QUEUE = 'auth:kyc'
export const SUMSUB_QUEUE = 'auth:sumsub'
export const EXPORT_USER_QUEUE = 'auth:user_export'
export const EXPORT_USER_TAG_QUEUE = 'auth:user_tag_export'

export enum UserJob {
  USER_REQUEST_DELETE_ACCOUNT = 'user_request_delete_account',
  USER_DELETE_ACCOUNT = 'user_delete_account',
  USER_CREATED = 'user_created',
  USER_BAN = 'user_ban',
  USER_UNBAN = 'user_unban',
  AUTHENTICATOR_STATUS_UPDATED = 'authenticator_verify_status_change',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_CHANGE_EMAIL = 'user_change_email',
  USER_CHANGE_LV = 'user_change_lv',
  USER_CHANGE_INFO = 'user_change_info',
  USER_CHANGE_PASSWORD = 'user_change_password',
  USER_PROACTIVELY_LOGOUT = 'user_proactively_logout',
  USER_CHECK_EMAIL = 'user_check_email',
  USER_UPDATED = 'user_updated',
}

export enum KycJob {
  KYC_REGISTERED = 'kyc_registered',
  KYC_STATUS_UPDATED = 'kyc_status_updated',
  KYC_DOCUMENT_APPROVED = 'kyc_document_approved',
  AUTO_KYC_FINISHED = 'auto_kyc_finished',
}

export enum SumsubJob {
  SUMSUB_APPLICANT_PENDING = 'sumsub_applicant_pending',
  SUMSUB_APPLICANT_REVIEWED = 'sumsub_applicant_reviewed',
}

export const UserExportType = {
  'user-basic-info': EXPORT_USER_QUEUE,
  'user-tag': EXPORT_USER_TAG_QUEUE,
}

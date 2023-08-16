export enum AuthValidationError {
  FAIL = 'AUTH.VALIDATION_FAIL',
  REQUIRED = 'AUTH.REQUIRED',
  IS_EMAIL = 'AUTH.IS_EMAIL',
  IS_NUMBER = 'AUTH.IS_NUMBER',
  IS_STRING = 'AUTH.IS_STRING',
  IS_DATE = 'AUTH.IS_DATE',
  MIN_LENGTH = 'AUTH.MIN_LENGTH_$constraint1',
  MAX_LENGTH = 'AUTH.MAX_LENGTH_$constraint1',
  MATCHES = 'AUTH.MATCHES',
  PASSWORD_TOO_WEAK = 'AUTH.PASSWORD_TOO_WEAK',
  IS_ENUM = 'AUTH.IS_ENUM',
  IS_FILE_TYPE = 'AUTH.IS_FILE_TYPE',
  IS_FILE_EXTENSION = 'AUTH.IS_FILE_EXTENSION',
  MAX_FILE_SIZE = 'AUTH.MAX_FILE_SIZE_$constraint1',
  ARRAY_MAX_SIZE = 'AUTH.ARRAY_MAX_SIZE_$constraint1',
  MAX_NUMBER = 'AUTH.MAX_NUMBER_$constraint1',
  MAX_DATE = 'AUTH.MAX_DATE_$constraint1',
}
export const FlowsError = {
  NOT_FOUND: { code: 10001, message: 'FLOW.NOT_FOUND' },
  INVALID: { code: 10002, message: 'FLOW.INVALID' },
}
export const CaptchaError = {
  INVALID: { code: 20001, message: 'CAPTCHA.INVALID' },
}
export const RegisterError = {
  MISSING_BOTH_EMAIL_AND_PHONE: {
    code: 30001,
    message: 'REGISTER.MISSING_BOTH_EMAIL_AND_PHONE',
  },
  EXISTED_USER: { code: 30002, message: 'REGISTER.EXISTED_USER' },
}
export const LoginError = {
  MISSING_BOTH_EMAIL_AND_PHONE: {
    code: 31001,
    message: 'LOGIN.MISSING_BOTH_EMAIL_AND_PHONE',
  },
  USER_DOES_NOT_EXIST: { code: 31002, message: 'LOGIN.USER_DOES_NOT_EXIST' },
  WRONG_PASSWORD: { code: 31003, message: 'LOGIN.WRONG_PASSWORD' },
  NEED_AUTHENTICATOR_OTP: {
    code: 31004,
    message: 'LOGIN.NEED_AUTHENTICATOR_OTP',
  },
  NEED_EMAIL_OTP: { code: 31005, message: 'LOGIN.NEED_EMAIL_OTP' },
  NEED_SMS_OTP: { code: 31006, message: 'LOGIN.NEED_SMS_OTP' },
  FAILED_TO_SEND_DEVICE_VERIFICATION_EMAIL: {
    code: 31007,
    message: 'LOGIN.FAILED_TO_SEND_DEVICE_VERIFICATION_EMAIL_MESSAGE',
  },
  WRONG_EMAIL_OTP: { code: 31008, message: 'LOGIN.WRONG_EMAIL_OTP' },
  INACTIVE_USER: { code: 31009, message: 'LOGIN.INACTIVE_USER' },
  NEED_AUTHENTICATOR_OTP_AND_EMAIL_OTP: {
    code: 31010,
    message: 'LOGIN.NEED_AUTHENTICATOR_OTP_AND_EMAIL_OTP',
  },
  USER_BEING_DELETED: {
    code: 31011,
    message: 'LOGIN.USER_BEING_DELETED',
  },
}
export const LogoutAllError = {
  WRONG_PASSWORD: { code: 32001, message: 'LOGOUT_ALL.WRONG_PASSWORD' },
}
export const ChangePasswordError = {
  USER_DOES_NOT_EXIST: {
    code: 33001,
    message: 'CHANGE_PASSWORD.USER_DOES_NOT_EXIST',
  },
  WRONG_PASSWORD: { code: 33002, message: 'CHANGE_PASSWORD.WRONG_PASSWORD' },
  SAME_AS_OLD_PASSWORD: {
    code: 33003,
    message: 'CHANGE_PASSWORD.SAME_AS_OLD_PASSWORD',
  },
  NEED_TURN_ON_2FA: {
    code: 33004,
    message: 'CHANGE_PASSWORD.NEED_TURN_ON_2FA',
  },
  NEED_AUTHENTICATOR_OTP: {
    code: 33005,
    message: 'CHANGE_PASSWORD.NEED_AUTHENTICATOR_OTP',
  },
}
export const VerifyAccountError = {
  EMAIL_HAS_BEEN_TAKEN: {
    code: 34001,
    message: 'VERIFY_ACCOUNT.EMAIL_HAS_BEEN_TAKEN',
  },
  WRONG_OTP: { code: 34002, message: 'VERIFY_ACCOUNT.WRONG_OTP' },
  FAILED_TO_SEND_EMAIL: {
    code: 34003,
    message: 'VERIFY_ACCOUNT.FAILED_TO_SEND_EMAIL',
  },
  FAILED_TO_SEND_SMS: {
    code: 34004,
    message: 'VERIFY_ACCOUNT.FAILED_TO_SEND_SMS',
  },
}
export const ForgotPasswordError = {
  USER_DOES_NOT_EXIST: {
    code: 35001,
    message: 'FORGOT_PASSWORD.USER_DOES_NOT_EXIST',
  },
  WRONG_OTP: { code: 35002, message: 'FORGOT_PASSWORD.WRONG_OTP' },
  FAILED_TO_SEND_EMAIL: {
    code: 35003,
    message: 'FORGOT_PASSWORD.FAILED_TO_SEND_EMAIL',
  },
  FAILED_TO_SEND_SMS: {
    code: 35004,
    message: 'FORGOT_PASSWORD.FAILED_TO_SEND_SMS',
  },
  NEED_AUTHENTICATOR_OTP: {
    code: 35005,
    message: 'FORGOT_PASSWORD.NEED_AUTHENTICATOR_OTP',
  },
}
export const AddEmailError = {
  EMAIL_TAKEN: { code: 36001, message: 'ADD_EMAIL.EMAIL_HAS_BEEN_TAKEN' },
  USER_DOES_NOT_EXIST: {
    code: 36002,
    message: 'ADD_EMAIL.USER_DOES_NOT_EXIST',
  },
  ALREADY_HAVE_AN_EMAIL: {
    code: 36003,
    message: 'ADD_EMAIL.ALREADY_HAVE_AN_EMAIL',
  },
}
export const FirebaseError = {
  INVALID_ID_TOKEN: { code: 37001, message: 'FIREBASE.INVALID_ID_TOKEN' },
  CAN_NOT_READ_EMAIL_ADDRESS: {
    code: 37002,
    message: 'FIREBASE.REQUIRE_EMAIL_ACCESS',
  },
  PROVIDER_IS_NOT_SUPPORTED: {
    code: 37003,
    message: 'FIREBASE.PROVIDER_IS_NOT_SUPPORTED',
  },
}
export const LogoutDeviceError = {
  WRONG_PASSWORD: { code: 38001, message: 'LOGOUT_DEVICE.WRONG_PASSWORD' },
}
export const AddAuthenticatorError = {
  AUTHENTICATOR_ALREADY_VERIFIED: {
    code: 39001,
    message: 'ADD_AUTHENTICATOR.AUTHENTICATOR_ALREADY_VERIFIED',
  },
  WRONG_PASSWORD: { code: 39002, message: 'ADD_AUTHENTICATOR.WRONG_PASSWORD' },
  WRONG_OTP: { code: 39003, message: 'ADD_AUTHENTICATOR.WRONG_OTP' },
}
export const DisableAuthenticatorError = {
  AUTHENTICATOR_ALREADY_DISABLED: {
    code: 40001,
    message: 'DISABLE_AUTHENTICATOR.AUTHENTICATOR_ALREADY_DISABLED',
  },
  WRONG_PASSWORD: {
    code: 40002,
    message: 'DISABLE_AUTHENTICATOR.WRONG_PASSWORD',
  },
  WRONG_OTP: { code: 40003, message: 'DISABLE_AUTHENTICATOR.WRONG_OTP' },
}
export const EmailExistError = {
  EXIST_IN_EMAIL: { code: 41001, message: 'EMAIL_EXIST.EXIST_IN_EMAIL' },
  EXIST_IN_FB: { code: 41002, message: 'EMAIL_EXIST.EXIST_IN_FB' },
  EXIST_IN_GG: { code: 41003, message: 'EMAIL_EXIST.EXIST_IN_GG' },
  EXIST_IN_APPLE: { code: 41004, message: 'EMAIL_EXIST.EXIST_IN_APPLE' },
}
export const TokenError = {
  INVALID: { code: 42001, message: 'TOKEN.INVALID' },
  EXPIRED: { code: 42002, message: 'TOKEN.EXPIRED' },
  DEVICE_NOT_FOUND: { code: 42003, message: 'TOKEN.DEVICE_NOT_FOUND' },
  DEVICE_NOT_MATCH: { code: 42004, message: 'TOKEN.DEVICE_NOT_MATCH' },
  EMQX_INVALID_IP_PUB: { code: 42005, message: 'TOKEN.EMQX_INVALID_IP_PUB' },
  EMQX_INVALID_ACCESS: { code: 42005, message: 'TOKEN.EMQX_INVALID_ACCESS' },
}
export const ChangeEmailError = {
  USER_DOES_NOT_HAVE_EMAIL: {
    code: 43001,
    message: 'CHANGE_EMAIL.USER_DOES_NOT_HAVE_EMAIL',
  },
  SAME_AS_CURRENT_EMAIL: {
    code: 43002,
    message: 'CHANGE_EMAIL.SAME_AS_CURRENT_EMAIL',
  },
  FAIL_TO_SEND_CURRENT_EMAIL_OTP: {
    code: 43003,
    message: 'CHANGE_EMAIL.FAIL_TO_SEND_CURRENT_EMAIL_OTP',
  },
  FAIL_TO_SEND_NEW_EMAIL_OTP: {
    code: 43004,
    message: 'CHANGE_EMAIL.FAIL_TO_SEND_NEW_EMAIL_OTP',
  },
  WRONG_CURRENT_EMAIL_OTP: {
    code: 43005,
    message: 'CHANGE_EMAIL.WRONG_CURRENT_EMAIL_OTP',
  },
  WRONG_NEW_EMAIL_OTP: {
    code: 43006,
    message: 'CHANGE_EMAIL.WRONG_NEW_EMAIL_OTP',
  },
  WRONG_PASSWORD: {
    code: 43007,
    message: 'CHANGE_EMAIL.WRONG_PASSWORD',
  },
}
export const BlacklistError = {
  USER_BLACKLISTED: { code: 44001, message: 'BLACKLIST.USER_BLACKLISTED' },
  DEVICE_BLACKLISTED: { code: 44002, message: 'BLACKLIST.DEVICE_BLACKLISTED' },
}
export const UserInfoError = {
  INFO_NOT_FOUND: {
    code: 45001,
    message: 'USER_INFO.INFO_NOT_FOUND',
  },
  INFO_EXISTED: {
    code: 45002,
    message: 'USER_INFO.INFO_EXISTED',
  },
  INFO_SUBMITTED: {
    code: 45003,
    message: 'USER_INFO.INFO_SUBMITTED',
  },
  DUPLICATE_INFO: {
    code: 45004,
    message: 'USER_INFO.DUPLICATE_INFO',
  },
  CAN_NOT_CHANGE_FIELD_AFTER_VERIFIED: {
    code: 45005,
    message: 'USER_INFO.CAN_NOT_CHANGE_FIELD_AFTER_VERIFIED',
  },
}
export const UploadFileError = {
  UPLOAD_FAIL: {
    code: 46001,
    message: 'UPLOAD_FILE.UPLOAD_FAIL',
  },
  METADATA_NOT_SUPPORTED: {
    code: 46002,
    message: 'UPLOAD_FILE.METADATA_NOT_SUPPORTED',
  },
}
export const KycError = {
  HAVE_PENDING_KYC: {
    code: 47001,
    message: 'KYC.HAVE_PENDING_KYC',
  },
  DOES_NOT_HAVE_INFO: {
    code: 47002,
    message: 'KYC.DOES_NOT_HAVE_INFO',
  },
  FILE_METADATA_NOT_MATCH: {
    code: 47003,
    message: 'KYC.FILE_METADATA_NOT_MATCH',
  },
  DUPLICATE_ID_DOCUMENT_NO: {
    code: 47004,
    message: 'KYC.DUPLICATE_ID_DOCUMENT_NO',
  },
  USER_EMAIL_NOT_VERIFIED: {
    code: 47005,
    message: 'KYC.USER_EMAIL_NOT_VERIFIED',
  },
  KYC_TYPE_CONFLICT: {
    code: 47006,
    message: 'KYC.KYC_TYPE_CONFLICT',
  },
  NOT_FOUND: {
    code: 47007,
    message: 'KYC.NOT_FOUND',
  },
  INVALID_STATUS: {
    code: 47008,
    message: 'KYC.INVALID_STATUS',
  },
  INVALID_DOCUMENT_TYPE: {
    code: 47009,
    message: 'KYC.INVALID_DOCUMENT_TYPE',
  },
}
export const OcrError = {
  INVALID_FILE: {
    code: 48001,
    message: 'OCR.INVALID_FILE',
  },
}
export const AuthenticatorError = {
  WRONG_AUTHENTICATOR_OTP: {
    code: 49001,
    message: 'AUTHENTICATOR.WRONG_AUTHENTICATOR_OTP',
  },
  AUTHENTICATOR_CODE_USED: {
    code: 49002,
    message: 'AUTHENTICATOR.AUTHENTICATOR_CODE_USED',
  },
}
export const UserError = {
  NOT_FOUND: {
    code: 51001,
    message: 'USER.NOT_FOUND',
  },
}
export const CynopsisError = {
  NOT_FOUND: {
    code: 52001,
    message: 'CYNOPSIS.NOT_FOUND',
  },
  FAIL_TO_GET_DATA: {
    code: 52002,
    message: 'CYNOPSIS.FAIL_TO_GET_DATA',
  },
}
export const OtpError = {
  RESEND_BLOCKING: {
    code: 53001,
    message: 'OTP.RESEND_BLOCKING',
  },
}
export const DeleteAccountError = {
  WRONG_PASSWORD: { code: 54001, message: 'DELETE_ACCOUNT.WRONG_PASSWORD' },
}

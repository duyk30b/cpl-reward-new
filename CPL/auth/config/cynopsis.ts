export default () => ({
  cynopsis: {
    auth_url: process.env.CYNOPSIS_AUTH_URL,
    ares_secret_token: process.env.ARES_SECRET_TOKEN,
    ocr_api_url: process.env.CYNOPSIS_OCR_API_URL,
    compare_api_url: process.env.CYNOPSIS_COMPARE_API_URL,
    create_an_individual_customer_api_url:
      process.env.CYNOPSIS_CREATE_AN_INDIVIDUAL_CUSTOMER_API_URL,
    get_record_id_api_url: process.env.CYNOPSIS_GET_RECORD_ID_API_URL,
    get_risk_report_api_url: process.env.CYNOPSIS_GET_REPORT_ARTEMIS_API_URL,
    post_screening_db_api_url: process.env.CYNOPSIS_POST_SCREENING_DB_API_URL,
    post_screening_internet_api_url:
      process.env.CYNOPSIS_POST_SCREENING_INTERNET_API_URL,
    post_risk_report_api_url: process.env.CYNOPSIS_POST_RISK_REPORT_API_URL,
    name_key_artemis: process.env.NAME_KEY_ARTEMIS,
    amz_cognito_username: process.env.AMZ_COGNITO_USERNAME,
    amz_cognito_password: process.env.AMZ_COGNITO_PASSWORD,
    amz_cognito_pool_id: process.env.AMZ_COGNITO_POOL_ID,
    amz_cognito_client_id: process.env.AMZ_COGNITO_CLIENT_ID,
  },
})

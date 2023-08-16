enum Actions {
  // action types
  ADD_BODY_CLASSNAME = 'addBodyClassName',
  REMOVE_BODY_CLASSNAME = 'removeBodyClassName',
  ADD_BODY_ATTRIBUTE = 'addBodyAttribute',
  REMOVE_BODY_ATTRIBUTE = 'removeBodyAttribute',
  ADD_CLASSNAME = 'addClassName',
  LOGIN = 'login',
  VERIFY_LOGIN = 'verifyLogin',
  REFRESH_ACCESS_TOKEN = 'refreshAccessToken',
  LOGOUT = 'logout',
  REGISTER = 'register',
  UPDATE_USER = 'updateUser',
  FORGOT_PASSWORD = 'forgotPassword',
  SET_BREADCRUMB_ACTION = 'setBreadcrumbAction',
  FETCH_KAFKA_EVENTS_ACTION = 'fetchKafkaEventsAction',
  FETCH_GRANT_TARGET_ACTION = 'fetchGrantTargetAction',
  FETCH_USER_CONDITION_ACTION = 'fetchUserConditionAction',
  FETCH_DISPLAY_CONDITION_ACTION = 'fetchDisplayConditionAction',
  FETCH_MASTERDATA = 'fetchMasterdata',
  FETCH_MISSING_REWARDS_COUNT = 'fetchMissingRewardsCount',
  FETCH_LIST_COIN = 'fetchListCoin',
  FETCH_LIST_COIN_RAW = 'fetchListCoinRaw',
  // High Low
  FETCH_GET_MODES = 'fetchGetModes',
  FETCH_GET_PAIRS = 'fetchGetPairs',
  FETCH_GET_PERIOD = 'fetchGetPeriod',

  // Translates
  FETCH_CATEGORY_TRANSLATES = 'fetchCategoryTranslates',
  FETCH_CODE_LANGUAGES_ACTIVE = 'fetchCodeLanguagesActive',
}

enum Mutations {
  // mutation types
  SET_CLASSNAME_BY_POSITION = 'appendBreadcrumb',
  PURGE_AUTH = 'logOut',
  SET_AUTH = 'setAuth',
  SET_USER = 'setUser',
  SET_ERROR = 'setError',
  SET_BREADCRUMB_MUTATION = 'setBreadcrumbMutation',
  SET_LAYOUT_CONFIG = 'setLayoutConfig',
  RESET_LAYOUT_CONFIG = 'resetLayoutConfig',
  OVERRIDE_LAYOUT_CONFIG = 'overrideLayoutConfig',
  OVERRIDE_PAGE_LAYOUT_CONFIG = 'overridePageLayoutConfig',
  SET_KAFKA_EVENTS = 'setKafkaEvents',
  SHOW_API_LOADING = 'showApiLoading',
  SET_GRANT_TARGET = 'setGrantTarget',
  SET_USER_CONDITION = 'setUserCondition',
  SET_DISPLAY_CONDITION = 'setDisplayCondition',
  SET_MASTERDATA = 'setMasterdata',
  SET_REFRESH_DATA = 'setRefreshData',
  SET_MISSING_REWARDS_COUNT = 'setMissingRewardsCount',
  SET_LIST_COIN = 'setListCoin',
  SET_LIST_COIN_RAW = 'setListCoinRaw',
  // High low
  SET_MODES = 'setModes',
  SET_PAIRS = 'setPairs',
  SET_PERIOD = 'setPeriod',

  // Translates
  SET_CATEGORY_TRANSLATES = 'setCategoryTranslates',
  SET_LOADING_CATEGORY_TRANSLATE = 'setLoadingCategoryTranslate',
  SET_CODE_LANGUAGES_ACTIVE = 'setCodeLanguagesActive',
}

enum Getters {
  GET_MISSING_REWARDS_COUNT = 'getMissingRewardsCount',
  GET_MODES = 'getModes',
}

export { Actions, Mutations, Getters }

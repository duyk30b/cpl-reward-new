export const DisplayConditionSettings = {
  account_lv: {
    type: 'number',
    display: 'enum',
    options: { LV_1: 1, LV_2: 2, LV_3: 3, LV_4: 4 },
  },
  kyc_verify_status: {
    type: 'number',
    display: 'enum',
    options: { VERIFIED: 1, UNVERIFIED: 2, PENDING: 3, REJECTED: 4 },
  },
  user_info_status: {
    type: 'number',
    display: 'enum',
    options: { UPDATED: 1, NOT_UPDATED: 2 },
  },
  id: { type: 'number', display: 'number', label: 'User ID' },
  'user_info.nationality_id': { type: 'number', display: 'select', label: 'Nationality' },
}

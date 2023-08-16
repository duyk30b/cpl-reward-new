export const UnauthorizedSwagger = {
  schema: {
    properties: {
      statusCode: { type: 'number', example: 401 },
      msg: { type: 'string', example: 'UNAUTHORIZED' },
      timestamp: { type: 'string', example: '2022-05-05T03:49:34.636Z' },
      path: { type: 'string' },
    },
  },
}

export const AffiliateEarnedShortSwaggerResponse = {
  schema: {
    properties: {
      history_currency: { type: 'string', example: 'BCAST' },
      history_wallet: {
        type: 'number',
        example: 1,
        description: 'BALANCE = 1, CASHBACK = 2, DIVIDEND = 3',
      },
      total_amount: { type: 'string', example: '1.200000000000000000' },
    },
  },
}

export const RedeemMissionResponse = {
  schema: {
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
    },
  },
}

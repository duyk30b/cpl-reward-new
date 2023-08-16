export enum DIVIDEND_SPAN {
  ONCE = 'once',
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum DIVIDEND_CALCULATED_MODE {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  NON_CONDITION = 'non_condition',
}
export enum DISTRIBUTE_TYPE {
  INPUT_CODE = 'input_code',
  INDICATED_BALANCE = 'indicated_balance',
  NON_INDICATED_BALANCE = 'non_indicated_balance',
}

export enum STATUS {
  PENDING = 'pending',
  // RUNNING = 'running',
  EXECUTING = 'executing',
  CANCELLED = 'cancelled',
  FINISHED = 'finished',
}

export enum ALLOCATE_STATUS {
  NO_ALLOCATE = 'no_allocate',
  ALLOCATED = 'allocated',
}

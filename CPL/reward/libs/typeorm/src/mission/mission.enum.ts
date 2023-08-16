export enum MISSION_STATUS {
  RUNNING = 1,
  OUT_OF_BUDGET = 2,
  ENDED = 3,
  COMING_SOON = 4,
}

export enum TARGET_TYPE {
  HYBRID = 1,
  ONLY_MAIN = 2,
  ONLY_REFERRED = 3,
}

export enum GRANT_METHOD {
  FIXED = 'fixed',
  PERCENT = 'percent',
}

export enum MISSION_TYPE {
  DEFAULT = 0,
  DAILY = 3,
}

export enum SearchFieldMission {
  title = 'title',
  title_ja = 'titleJa',
  guide_link = 'guideLink',
  guide_link_ja = 'guideLinkJa',
  detail_explain = 'detailExplain',
  detail_explain_ja = 'detailExplainJa',
}

export enum SortFieldMission {
  id = 'id',
  title = 'title',
  title_ja = 'titleJa',
  detail_explain = 'detailExplain',
  detail_explain_ja = 'detailExplainJa',
  guide_link = 'guideLink',
  guide_link_ja = 'guideLinkJa',
  opening_date = 'openingDate',
  closing_date = 'closingDate',
  priority = 'priority',
  status = 'status',
}

export enum CAMPAIGN_TYPE {
  DEFAULT = 0,
  DAILY = 3,
}

export enum CAMPAIGN_STATUS {
  RUNNING = 1,
  OUT_OF_BUDGET = 2,
  ENDED = 3,
  COMING_SOON = 4,
}

export enum SearchFieldCampaign {
  title = 'title',
  title_ja = 'titleJa',
  description = 'description',
  description_ja = 'descriptionJa',
  notification_link = 'notificationLink',
  notification_link_ja = 'notificationLinkJa',
  campaign_image = 'campaignImage',
  campaign_image_ja = 'campaignImageJa',
}

export enum SortFieldCampaign {
  id = 'id',
  title = 'title',
  title_ja = 'titleJa',
  description = 'description',
  description_ja = 'descriptionJa',
  notification_link = 'notificationLink',
  notification_link_ja = 'notificationLinkJa',
  campaign_image = 'campaignImage',
  campaign_image_ja = 'campaignImageJa',
  start_date = 'startDate',
  end_date = 'endDate',
  type = 'type',
  status = 'status',
  priority = 'priority',
  created_at = 'createdAt',
}

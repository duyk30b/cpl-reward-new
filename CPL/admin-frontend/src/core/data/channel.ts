import { Expose, Exclude } from 'class-transformer'
import { Tag } from './tag'

export class ChannelEntity {
  @Exclude({ toPlainOnly: true })
  @Expose()
  id: number

  @Expose()
  name = ''

  @Expose()
  link = ''

  @Expose({ name: 'dynamic_link' })
  dynamicLink = ''

  @Expose({ name: 'tag_ids' })
  tagIds = '[]'

  @Expose()
  tags?: Array<Tag>
}

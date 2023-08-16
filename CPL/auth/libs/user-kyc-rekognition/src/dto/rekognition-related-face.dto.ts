import { Expose } from 'class-transformer'

export class RelatedFaceDto {
  @Expose({ name: 'face_id' })
  faceId: string

  @Expose()
  similarity: string

  @Expose({ name: 'image_url' })
  imageUrl: string

  @Expose()
  detail: string

  @Expose({ name: 'detected_at' })
  detectedAt: number
}

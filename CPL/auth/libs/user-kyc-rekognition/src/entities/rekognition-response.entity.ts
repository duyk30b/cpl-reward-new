import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity()
export class RekognitionResponse {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'rekognition_info_history_id' })
  @Expose({ name: 'rekognition_info_history_id' })
  rekognitionInfoHistoryId: string

  @Column({
    name: 'compare_response',
    type: 'json',
  })
  @Expose({ name: 'compare_response' })
  compareResponse: Record<string, any>

  @Column({ name: 'compare_error' })
  @Expose({ name: 'compare_error' })
  compareError: string

  @Column({
    name: 'related_faces_response',
    type: 'json',
  })
  @Expose({ name: 'related_faces_response' })
  relatedFacesResponse: Record<string, any>

  @Column({ name: 'related_faces_error' })
  @Expose({ name: 'related_faces_error' })
  relatedFacesError: string

  @Column({
    name: 'face_index_response',
    type: 'json',
  })
  @Expose({ name: 'face_index_response' })
  faceIndexResponse: Record<string, any>

  @Column({ name: 'face_index_error' })
  @Expose({ name: 'face_index_error' })
  faceIndexError: string
}

export interface CompareFacesResponse {
  SourceImageFace?: ComparedSourceImageFace
  FaceMatches?: CompareFacesMatch[]
  UnmatchedFaces?: ComparedFace[]
}

export interface ComparedSourceImageFace {
  BoundingBox?: BoundingBox
  Confidence?: number
}

export interface BoundingBox {
  Width?: number
  Height?: number
  Left?: number
  Top?: number
  color?: string
}

export interface CompareFacesMatch {
  Similarity?: number
  Face?: ComparedFace
}

export interface ComparedFace {
  BoundingBox?: BoundingBox
  Confidence?: number
}

export interface SearchFacesResponse {
  SearchedFaceId?: string
  FaceMatches?: FaceMatch[]
  FaceModelVersion?: string
}

export interface FaceMatch {
  Similarity?: number
  Face?: Face
}

export interface Face {
  FaceId?: string
  BoundingBox?: BoundingBox
  ImageId?: string
  ExternalImageId?: string
  Confidence?: number
  IndexFacesModelVersion?: string
}

export interface IndexFacesResponse {
  FaceRecords?: FaceRecord[]
  UnindexedFaces?: UnindexedFace[]
}

export interface FaceRecord {
  Face?: Face
  FaceDetail?: FaceDetail
}

export interface UnindexedFace {
  Reasons?: string[]
  FaceDetail?: FaceDetail
}

export interface FaceDetail {
  BoundingBox?: BoundingBox
  Confidence?: number
}

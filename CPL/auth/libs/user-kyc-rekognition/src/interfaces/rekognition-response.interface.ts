export interface IUpdateRekognitionResponse {
  compareResponse?: Record<string, any>
  relatedFacesResponse?: Record<string, any>
  faceIndexResponse?: Record<string, any>
  compareError?: string
  relatedFacesError?: string
  faceIndexError?: string
}

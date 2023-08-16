import {
  KycIdDocumentMetadata,
  KycIdDocumentType,
} from '@lib/user-kyc/enum/user-kyc.enum'

export const TWO_SIDE_DOCUMENT_TYPES = [
  KycIdDocumentType.ID_CARD,
  KycIdDocumentType.DRIVING_LICENCE,
]

export const DOCUMENT_SIDE_METADATA_MAP = {
  FRONT: {
    [KycIdDocumentType.PASSPORT]: KycIdDocumentMetadata.PASSPORT,
    [KycIdDocumentType.ID_CARD]: KycIdDocumentMetadata.ID_CARD_FRONT,
    [KycIdDocumentType.DRIVING_LICENCE]:
      KycIdDocumentMetadata.DRIVING_LICENCE_FRONT,
    [KycIdDocumentType.RESIDENCE_CARD]:
      KycIdDocumentMetadata.RESIDENCE_CARD_FRONT,
    [KycIdDocumentType.NUMBER_CARD]: KycIdDocumentMetadata.NUMBER_CARD_FRONT,
  },
  BACK: {
    [KycIdDocumentType.ID_CARD]: KycIdDocumentMetadata.ID_CARD_BACK,
    [KycIdDocumentType.DRIVING_LICENCE]:
      KycIdDocumentMetadata.DRIVING_LICENCE_BACK,
    [KycIdDocumentType.RESIDENCE_CARD]:
      KycIdDocumentMetadata.RESIDENCE_CARD_BACK,
  },
}

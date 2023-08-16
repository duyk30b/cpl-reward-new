export interface IKycSetting {
  personalImageProviders: number[]
  enterpriseImageProviders: number[]
  personalRiskScanProviders: number[]
  enterpriseRiskScanProviders: number[]
  compareFaceThreshold: number
  maxFacesFind: number
  duplicateFaceAdminRejectThreshold: number
  duplicateFaceAutoRejectThreshold: number
  duplicateFaceWarningThreshold: number
}

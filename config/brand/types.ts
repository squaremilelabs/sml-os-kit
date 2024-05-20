export interface BrandConfig {
  appName: string
  orgName: string
  orgNamePossesive: string
  orgTicker: string
  orgSlug: string
  assetPaths: {
    logoOnLight: string
    logoOnDark: string
    [customKey: string]: string
  }
  colors: {
    [colorKey: string]: string
  }
}

export interface CertificateSiteListItemModel {
  siteName: string;
  siteNameInPrimaryLanguage: string;
  siteNameInSecondaryLanguage: string;
  siteAddressInPrimaryLanguage: string;
  siteAddressInSecondaryLanguage: string;
  siteAddress: string;
  iconTooltip: CertificateIconTooltipModel;
  siteScope: string;
  primaryLanguageSiteScope: string;
  secondaryLanguageSiteScope: string;
}

export interface CertificateIconTooltipModel {
  displayIcon: boolean;
  tooltipMessage: string;
  iconClass: string;
  iconPosition: string;
}

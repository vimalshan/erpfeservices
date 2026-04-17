import { GridConfig } from '@customer-portal/shared';

import {
  CertificateDetailsModel,
  CertificateSiteListItemModel,
  CertificationMarksListItemModel,
} from '../../models';
import { CertificateDocumentsListItemModel } from '../../models/certificate-documents-list-item.model';

// #region CertificateDetails
export class LoadCertificateDetails {
  static readonly type = '[Certificate Details] Load Certificate Details';
}

export class LoadCertificateDetailsSuccess {
  static readonly type =
    '[Certificate Details] Load Certificate Details Success';

  constructor(public certificateDetails: CertificateDetailsModel) {}
}

export class LoadAllCertificationMarks {
  static readonly type = '[Certificate Details] Load All Certification Marks';

  constructor(
    public serviceName: string,
    public language: string,
  ) {}
}

export class LoadAllCertificationMarksSuccess {
  static readonly type =
    '[Certificate Details] Load All Certification Marks Success';

  constructor(
    public allCertificationMarks: CertificationMarksListItemModel[],
  ) {}
}

export class DownloadCertificationMark {
  static readonly type = '[Certificate Details] Download Certification Mark';

  constructor(
    public downloadLink: string,
    public fileName: string,
  ) {}
}

export class DownloadCertificationMarkSuccess {
  static readonly type =
    '[Certificate Details] Download Certification Mark Success';

  constructor(
    public blobArray: ArrayLike<number> | ArrayBuffer,
    public fileName: string,
    public downloadLink: string,
  ) {}
}

export class DownloadCertificationMarkFailure {
  static readonly type =
    '[Certificate Details] Download Certification Mark Fail';
}

export class ChangeCertificateDetailsLanguage {
  static readonly type =
    '[Certificate Details] Change Certificate Details Language';

  constructor(public selectedLanguage: string) {}
}

export class ChangeCertificateSiteItemsLanguage {
  static readonly type =
    '[Certificate Details] Change Certificate Site Items Language';

  constructor(public selectedLanguage: string) {}
}

export class ResetCertificateDetailsState {
  static readonly type =
    '[Certificate Details] Reset Certificate Details State';
}

export class ResetAllCertificationMarks {
  static readonly type =
    '[Certificate Details] Reset All Certification Marks In State';
}

export class NavigateToNewCertificate {
  static readonly type = '[Certificate Details] Navigate To New Certificate';

  constructor(public newCertificateId: number | null) {}
}

// #endregion CertificateDetails

// #region CertificateSitesList
export class LoadCertificateSitesList {
  static readonly type =
    '[Certificate Details] Load Certificate Sites List Items';
}

export class LoadCertificateSitesListSuccess {
  static readonly type =
    '[Certificate Details] Load Certificate Sites List Items Success';

  constructor(public certificateSiteItems: CertificateSiteListItemModel[]) {}
}
export class LoadCertificateSitesListFail {
  static readonly type =
    '[Certificate Details] Load Certificate Sites List Items failed';
}
export class UpdateCertificateSitesListGridConfig {
  static readonly type =
    '[Certificate Details] Update Certificate Sites Grid Config';

  constructor(public certificateSiteItemsGridConfig: GridConfig) {}
}

export class UpdateCertificateSitesListFilterOptions {
  static readonly type =
    '[Certificate Details] Update Certificate Sites Filters Config';

  constructor(public certificateSiteItems: CertificateSiteListItemModel[]) {}
}
// #endregion CertificateSitesList

// #region CertificateDocumentsList

export class LoadCertificateDocumentsList {
  static readonly type =
    '[Certificate Details] Load Certificate Documents List Items';
}

export class LoadCertificateDocumentsListSuccess {
  static readonly type =
    '[Certificate Details] Load Certificate Documents List Items Success';

  constructor(
    public certificateDocumentsList: CertificateDocumentsListItemModel[],
  ) {}
}

export class LoadCertificateDocumentsListFail {
  static readonly type =
    '[Certificate Details] Load Certificate Document List Items failed';
}
export class UpdateCertificateDocumentsListGridConfig {
  static readonly type =
    '[Certificate Details] Update Certificate Documents Grid Config';

  constructor(public certificateDocumentsGridConfig: GridConfig) {}
}

export class UpdateCertificateDocumentsListFilterOptions {
  static readonly type =
    '[Certificate Details] Update Certificate Documents Filters Config';

  constructor(
    public certificateDocumentsList: CertificateDocumentsListItemModel[],
  ) {}
}

// #endregion CertificateDocumentsList

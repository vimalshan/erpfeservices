import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, filter, switchMap, tap } from 'rxjs';

import { RouteStoreService } from '@customer-portal/router';
import {
  AppPagesEnum,
  DEFAULT_GRID_CONFIG,
  StatusStates,
} from '@customer-portal/shared/constants';
import { getContentType } from '@customer-portal/shared/helpers';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { downloadFromByteArray } from '@customer-portal/shared/helpers/download';
import { getFilterOptionsForColumn } from '@customer-portal/shared/helpers/grid';
import { ToastSeverity } from '@customer-portal/shared/models';
import { FilterOptions, GridConfig } from '@customer-portal/shared/models/grid';

import {
  CertificateDetailsModel,
  CertificateDocumentsListItemModel,
  CertificateSiteListItemModel,
  CertificationMarksListItemModel,
} from '../models';
import {
  CertificateDetailsMapperService,
  CertificateDocumentsListService,
  CertificatesDetailsService,
} from '../services';
import {
  ChangeCertificateDetailsLanguage,
  ChangeCertificateSiteItemsLanguage,
  DownloadCertificationMark,
  DownloadCertificationMarkFailure,
  DownloadCertificationMarkSuccess,
  LoadAllCertificationMarks,
  LoadAllCertificationMarksSuccess,
  LoadCertificateDetails,
  LoadCertificateDetailsSuccess,
  LoadCertificateDocumentsList,
  LoadCertificateDocumentsListFail,
  LoadCertificateDocumentsListSuccess,
  LoadCertificateSitesList,
  LoadCertificateSitesListFail,
  LoadCertificateSitesListSuccess,
  NavigateToNewCertificate,
  ResetAllCertificationMarks,
  ResetCertificateDetailsState,
  UpdateCertificateDocumentsListFilterOptions,
  UpdateCertificateDocumentsListGridConfig,
  UpdateCertificateSitesListFilterOptions,
  UpdateCertificateSitesListGridConfig,
} from './actions';

export interface CertificateDetailsStateModel {
  certificateDetails: CertificateDetailsModel;
  allCertificationMarks: CertificationMarksListItemModel[];
  siteItemsGridConfig: GridConfig;
  siteItemsFilterOptions: FilterOptions;
  certificateDocumentsGridConfig: GridConfig;
  certificateDocumentsFilterOptions: FilterOptions;
  sites: {
    loading: boolean;
    error: string | null;
    list: CertificateSiteListItemModel[];
  };
  documents: {
    loading: boolean;
    error: string | null;
    list: CertificateDocumentsListItemModel[];
  };
}

const defaultState: CertificateDetailsStateModel = {
  certificateDetails: {
    certificateId: 0,
    certificateNumber: '',
    newCertificateId: null,
    accountDNVId: 0,
    header: {
      creationDate: '',
      documentMarks: [],
      issuedDate: '',
      languages: [],
      newRevisionNumber: 0,
      revisionNumber: 0,
      scopes: [],
      services: '',
      siteAddress: '',
      siteName: '',
      status: '',
      suspendedDate: '',
      validUntilDate: '',
      withdrawnDate: '',
      qRCodeLink: '',
      reportingCountry: '',
      projectNumber: '',
    },
  },
  allCertificationMarks: [
    {
      fileName: '',
      actions: [],
    },
  ],
  siteItemsGridConfig: DEFAULT_GRID_CONFIG,
  siteItemsFilterOptions: {},
  certificateDocumentsGridConfig: DEFAULT_GRID_CONFIG,
  certificateDocumentsFilterOptions: {},
  sites: {
    loading: false,
    error: '',
    list: [],
  },
  documents: {
    loading: false,
    error: '',
    list: [],
  },
};

@State<CertificateDetailsStateModel>({
  name: 'certificateDetails',
  defaults: defaultState,
})
@Injectable()
export class CertificateDetailsState {
  private certificateIdPathParam = 'certificateId';

  constructor(
    private certificatesDetailsService: CertificatesDetailsService,
    private routeStoreService: RouteStoreService,
    private certificateDocumentsListService: CertificateDocumentsListService,
    private messageService: MessageService,
  ) {}

  // #region CertificateDetails
  @Action(LoadCertificateDetails)
  loadCertificateDetails(ctx: StateContext<CertificateDetailsStateModel>) {
    return this.routeStoreService
      .getPathParamByKey(this.certificateIdPathParam)
      .pipe(
        switchMap((certificateId) =>
          this.certificatesDetailsService
            .getCertificatedDetails(Number(certificateId))
            .pipe(
              filter(
                (certificateDetailsDto) => certificateDetailsDto.isSuccess,
              ),
              tap((certificateDetailDto) => {
                const certificateDetails =
                  CertificateDetailsMapperService.mapToCertificateDetailsModel(
                    certificateDetailDto,
                  );

                if (certificateDetails) {
                  ctx.dispatch(
                    new LoadCertificateDetailsSuccess(certificateDetails),
                  );
                }
              }),
            ),
        ),
      );
  }

  @Action(LoadCertificateDetailsSuccess)
  loadCertificateDetailsSuccess(
    ctx: StateContext<CertificateDetailsStateModel>,
    { certificateDetails }: LoadCertificateDetailsSuccess,
  ): void {
    ctx.patchState({ certificateDetails });
  }

  @Action(LoadAllCertificationMarks)
  loadAllCertificationMarks(
    ctx: StateContext<CertificateDetailsStateModel>,
    { serviceName, language }: LoadAllCertificationMarks,
  ) {
    return this.certificatesDetailsService
      .getAllCertificationMarks(serviceName, language)
      .pipe(
        filter((certificationMarksDto) => certificationMarksDto.isSuccess),
        tap((certificationMarksDto) => {
          const certificationMarks =
            CertificateDetailsMapperService.mapToCertificationMarksModel(
              certificationMarksDto,
            );

          if (certificationMarks) {
            ctx.dispatch(
              new LoadAllCertificationMarksSuccess(certificationMarks),
            );
          }
        }),
      );
  }

  @Action(LoadAllCertificationMarksSuccess)
  loadAllCertificationMarksSuccess(
    ctx: StateContext<CertificateDetailsStateModel>,
    { allCertificationMarks }: LoadAllCertificationMarksSuccess,
  ): void {
    ctx.patchState({ allCertificationMarks });
  }

  @Action(DownloadCertificationMark)
  downloadCertificationMark(
    ctx: StateContext<CertificateDetailsStateModel>,
    { downloadLink, fileName }: DownloadCertificationMark,
  ) {
    return this.certificatesDetailsService
      .downloadCertificationMark(downloadLink)
      .pipe(
        filter((certificationMark) => certificationMark.isSuccess),
        tap((certificationMark) => {
          if (certificationMark) {
            ctx.dispatch(
              new DownloadCertificationMarkSuccess(
                certificationMark.data,
                fileName,
                downloadLink,
              ),
            );
          }
        }),
        catchError(() => ctx.dispatch(new DownloadCertificationMarkFailure())),
      );
  }

  @Action(DownloadCertificationMarkSuccess)
  downloadedCertificationMarkSuccesfully(
    _: StateContext<CertificateDetailsStateModel>,
    { blobArray, fileName, downloadLink }: DownloadCertificationMarkSuccess,
  ) {
    const fileExtension = getContentType(downloadLink, true);
    const constructedFileName = `${fileName}.${fileExtension}`;
    const constructedBlobArray = { body: new Uint8Array(blobArray) };

    downloadFromByteArray(constructedBlobArray, constructedFileName);

    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(DownloadCertificationMarkFailure)
  downloadedCertificationMarkWithError() {
    this.messageService.add(getToastContentBySeverity(ToastSeverity.Error));
  }

  @Action(ChangeCertificateDetailsLanguage)
  changeCertificateDetailsLanguage(
    ctx: StateContext<CertificateDetailsStateModel>,
    { selectedLanguage }: ChangeCertificateDetailsLanguage,
  ): void {
    const state = ctx.getState();
    const { certificateDetails } = state;
    const {
      header: { languages },
    } = certificateDetails;

    const selectedLanguageCode = state.certificateDetails.header.languages.find(
      (l) => l.name === selectedLanguage,
    )?.code;

    const updatedCertificateDetails = {
      ...state.certificateDetails,
      header: {
        ...state.certificateDetails.header,
        languages: languages.map((l) => ({
          name: l.name,
          code: l.code,
          isSelected: l.code === selectedLanguageCode,
          isPrimaryLanguage: l.isPrimaryLanguage,
        })),
      },
    };

    ctx.patchState({ certificateDetails: updatedCertificateDetails });
    ctx.dispatch(new ChangeCertificateSiteItemsLanguage(selectedLanguage));
  }

  @Action(ChangeCertificateSiteItemsLanguage)
  changeCertificateSiteItemsLanguage(
    ctx: StateContext<CertificateDetailsStateModel>,
    { selectedLanguage }: ChangeCertificateDetailsLanguage,
  ): void {
    const state = ctx.getState();
    const { certificateDetails, sites } = state;
    const { languages } = certificateDetails.header;

    const selectedLanguageCode = languages
      .find((language) => language.name === selectedLanguage)
      ?.code?.toLowerCase();

    const primaryLanguageCode = languages
      .find((language) => language.isPrimaryLanguage)
      ?.code?.toLowerCase();

    const updatedSiteItems = sites.list.map((site) => {
      const siteScope = this.getSiteScope(
        site,
        selectedLanguageCode,
        primaryLanguageCode,
      );
      const siteAddress = this.getSiteAddress(
        site,
        selectedLanguageCode,
        primaryLanguageCode,
      );
      const siteName = this.getSiteName(
        site,
        selectedLanguageCode,
        primaryLanguageCode,
      );

      return { ...site, siteAddress, siteName, siteScope };
    });
    ctx.patchState({
      sites: {
        ...ctx.getState().sites,
        list: updatedSiteItems,
      },
    });
    ctx.dispatch(new UpdateCertificateSitesListFilterOptions(updatedSiteItems));
  }

  @Action(ResetCertificateDetailsState)
  resetFindingDetailsState(ctx: StateContext<CertificateDetailsStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(ResetAllCertificationMarks)
  resetAllCertificationMarks(ctx: StateContext<CertificateDetailsStateModel>) {
    const defaultCertificationMarks = [
      {
        fileName: '',
        actions: [],
      },
    ];
    ctx.patchState({ allCertificationMarks: defaultCertificationMarks });
  }

  @Action(NavigateToNewCertificate)
  navigateToNewCertificate(
    ctx: StateContext<CertificateDetailsStateModel>,
    { newCertificateId }: NavigateToNewCertificate,
  ) {
    if (newCertificateId) {
      ctx.dispatch(
        new Navigate([`${AppPagesEnum.Certificates}/${newCertificateId}`]),
      );
    }
  }

  // #endregion CertificateDetails

  // #region CertificateSitesList
  @Action(LoadCertificateSitesList)
  loadSitesList(ctx: StateContext<CertificateDetailsStateModel>) {
    const currentState = ctx.getState();
    ctx.patchState({
      sites: {
        ...currentState.sites,
        loading: true,
        error: '',
      },
    });

    return this.routeStoreService
      .getPathParamByKey(this.certificateIdPathParam)
      .pipe(
        switchMap((certificateId) =>
          this.certificatesDetailsService
            .getSitesList(Number(certificateId))
            .pipe(
              filter(
                (certificateSitesListDto) => certificateSitesListDto.isSuccess,
              ),
              tap((certificateSitesListDto) => {
                const siteItems =
                  CertificateDetailsMapperService.mapToCertificateSitesItemModel(
                    certificateSitesListDto,
                  );

                if (siteItems) {
                  ctx.dispatch(new LoadCertificateSitesListSuccess(siteItems));

                  ctx.dispatch(
                    new UpdateCertificateSitesListFilterOptions(siteItems),
                  );
                }
              }),
            ),
        ),
        catchError(() => ctx.dispatch(new LoadCertificateSitesListFail())),
      );
  }

  @Action(LoadCertificateSitesListSuccess)
  loadSitesListSuccess(
    ctx: StateContext<CertificateDetailsStateModel>,
    { certificateSiteItems: siteItems }: LoadCertificateSitesListSuccess,
  ): void {
    ctx.patchState({
      sites: {
        error: '',
        list: siteItems,
        loading: false,
      },
    });
  }

  @Action(LoadCertificateSitesListFail)
  loadCertificateSitesListFail(ctx: StateContext<any>) {
    ctx.patchState({
      sites: {
        loading: false,
        list: [],
        error: 'Failed to load Certificate Sites List data',
      },
    });
  }

  @Action(UpdateCertificateSitesListFilterOptions)
  updateSitesListFilterOptions(
    ctx: StateContext<CertificateDetailsStateModel>,
    {
      certificateSiteItems: siteItems,
    }: UpdateCertificateSitesListFilterOptions,
  ): void {
    const siteItemsFilterOptions = {
      siteName: getFilterOptionsForColumn(siteItems, 'siteName'),
      siteAddress: getFilterOptionsForColumn(siteItems, 'siteAddress'),
      siteScope: getFilterOptionsForColumn(siteItems, 'siteScope'),
    };

    ctx.patchState({ siteItemsFilterOptions });
  }

  @Action(UpdateCertificateSitesListGridConfig)
  updateSitesListGridConfig(
    ctx: StateContext<CertificateDetailsStateModel>,
    {
      certificateSiteItemsGridConfig: siteItemsGridConfig,
    }: UpdateCertificateSitesListGridConfig,
  ): void {
    ctx.patchState({ siteItemsGridConfig });
  }
  // #endregion CertificateSitesList

  // #region CertificateDocumentsList
  @Action(LoadCertificateDocumentsList)
  loadCertificateDocumentsList(
    ctx: StateContext<CertificateDetailsStateModel>,
  ) {
    const state = ctx.getState();

    const { revisionNumber, status } = state.certificateDetails.header;
    const { certificateNumber } = state.certificateDetails;

    if (status === StatusStates.InProgress) {
      return EMPTY;
    }
    ctx.patchState({
      documents: {
        ...state.documents,
        loading: true,
        error: '',
      },
    });

    return this.certificateDocumentsListService
      .getCertificateDocumentsList(certificateNumber, revisionNumber)
      .pipe(
        throwIfNotSuccess(),
        tap((documentsListDto) => {
          const certificateDocumentsList =
            CertificateDetailsMapperService.mapToCertificateDocumentItemModel(
              documentsListDto,
            );

          ctx.dispatch(
            new LoadCertificateDocumentsListSuccess(certificateDocumentsList),
          );

          ctx.dispatch(
            new UpdateCertificateDocumentsListFilterOptions(
              certificateDocumentsList,
            ),
          );
        }),
        catchError(() => ctx.dispatch(new LoadCertificateDocumentsListFail())),
      );
  }

  @Action(LoadCertificateDocumentsListSuccess)
  loadCertificateDocumentsListSuccess(
    ctx: StateContext<CertificateDetailsStateModel>,
    { certificateDocumentsList }: LoadCertificateDocumentsListSuccess,
  ): void {
    ctx.patchState({
      documents: {
        error: '',
        list: certificateDocumentsList,
        loading: false,
      },
    });
  }

  @Action(LoadCertificateDocumentsListFail)
  loadCertificateDocumentsListFail(ctx: StateContext<any>) {
    ctx.patchState({
      documents: {
        list: [],
        error: 'Failed to load Certificate document List data',
        loading: false,
      },
    });
  }

  @Action(UpdateCertificateDocumentsListFilterOptions)
  updateCertificateDocumentsListFilterOptions(
    ctx: StateContext<CertificateDetailsStateModel>,
    { certificateDocumentsList }: UpdateCertificateDocumentsListFilterOptions,
  ): void {
    const certificateDocumentsFilterOptions = {
      fileName: getFilterOptionsForColumn(certificateDocumentsList, 'fileName'),
      type: getFilterOptionsForColumn(certificateDocumentsList, 'type'),
      uploadedBy: getFilterOptionsForColumn(
        certificateDocumentsList,
        'uploadedBy',
      ),
      language: getFilterOptionsForColumn(certificateDocumentsList, 'language'),
    };

    ctx.patchState({ certificateDocumentsFilterOptions });
  }

  @Action(UpdateCertificateDocumentsListGridConfig)
  updateCertificateDocumentsListGridConfig(
    ctx: StateContext<CertificateDetailsStateModel>,
    {
      certificateDocumentsGridConfig,
    }: UpdateCertificateDocumentsListGridConfig,
  ): void {
    ctx.patchState({ certificateDocumentsGridConfig });
  }
  // #endregion CertificateDocumentsList

  private getSiteScope = (
    site: CertificateSiteListItemModel,
    selectedLanguageCode?: string,
    primaryLanguageCode?: string,
  ): string =>
    primaryLanguageCode === selectedLanguageCode
      ? site.primaryLanguageSiteScope || ''
      : site.secondaryLanguageSiteScope || '';

  private getSiteAddress = (
    site: CertificateSiteListItemModel,
    selectedLanguageCode?: string,
    primaryLanguageCode?: string,
  ): string =>
    primaryLanguageCode === selectedLanguageCode
      ? site.siteAddressInPrimaryLanguage || ''
      : site.siteAddressInSecondaryLanguage || '';

  private getSiteName = (
    site: CertificateSiteListItemModel,
    selectedLanguageCode?: string,
    primaryLanguageCode?: string,
  ): string =>
    primaryLanguageCode === selectedLanguageCode
      ? site.siteNameInPrimaryLanguage || ''
      : site.siteNameInSecondaryLanguage || '';
}

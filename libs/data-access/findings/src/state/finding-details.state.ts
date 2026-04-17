import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, forkJoin, switchMap, tap } from 'rxjs';

import { LoggingService } from '@customer-portal/core';
import { UnreadActionsStoreService } from '@customer-portal/data-access/actions/state';
import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import { RouteStoreService } from '@customer-portal/router';
import { DEFAULT_GRID_CONFIG } from '@customer-portal/shared/constants';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { getFilterOptionsForColumn } from '@customer-portal/shared/helpers/grid';
import { ToastSeverity } from '@customer-portal/shared/models';
import { FilterOptions, GridConfig } from '@customer-portal/shared/models/grid';

import {
  FindingDetailsModel,
  FindingDocumentListItemModel,
  FindingHistoryResponseModel,
  FindingResponsesModel,
} from '../models';
import {
  FindingDetailsMapperService,
  FindingDetailsService,
  FindingDocumentsListMapperService,
  FindingDocumentsListService,
  FindingResponseHistoryMapperService,
  FindingResponseHistoryService,
} from '../services';
import {
  ChangeFindingDetailsLanguage,
  LoadFindingDetails,
  LoadFindingDetailsSuccess,
  LoadFindingDocumentsList,
  LoadFindingDocumentsListFail,
  LoadFindingDocumentsListSuccess,
  LoadLatestFindingResponses,
  LoadLatestFindingResponsesSuccess,
  LoadResponseFindingsHistory,
  LoadResponseFindingsHistorySuccess,
  ResetFindingDetailsState,
  SendFindingResponsesForm,
  SendFindingResponsesFormSuccess,
  SetIsFindingResponseFormDirtyFlag,
  SwitchIsRespondInProgress,
  UpdateDocumentFilterOptions,
  UpdateDocumentGridConfig,
} from './actions';

export interface FindingDetailsStateModel {
  findingDetails: FindingDetailsModel;
  latestFindingResponses: FindingResponsesModel | null;
  isFindingResponseFormDirty: boolean;
  isRespondInProgress: boolean;
  responseHistory: FindingHistoryResponseModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
  documents: {
    loading: boolean;
    error: string | null;
    list: FindingDocumentListItemModel[];
  };
}

const defaultState: FindingDetailsStateModel = {
  findingDetails: {
    findingNumber: '',
    header: {
      site: '',
      city: '',
      openDate: '',
      dueDate: '',
      closeDate: '',
      acceptedDate: '',
      auditor: '',
      auditType: '',
      auditNumber: '',
      services: '',
      status: '',
    },
    primaryLanguageDescription: {
      category: '',
      description: '',
      clause: '',
      focusArea: '',
      language: '',
      isPrimaryLanguage: false,
      isSelected: true,
      title: '',
    },
    secondaryLanguageDescription: {
      category: '',
      description: '',
      clause: '',
      focusArea: '',
      language: '',
      isPrimaryLanguage: false,
      isSelected: false,
      title: '',
    },
  },
  latestFindingResponses: null,
  responseHistory: [],
  isRespondInProgress: false,
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
  isFindingResponseFormDirty: false,
  documents: {
    loading: false,
    error: '',
    list: [],
  },
};

@State<FindingDetailsStateModel>({
  name: 'findingDetails',
  defaults: defaultState,
})
@Injectable()
export class FindingDetailsState {
  constructor(
    private findingDetailsService: FindingDetailsService,
    private findingResponseHistory: FindingResponseHistoryService,
    private findingDocumentsListService: FindingDocumentsListService,
    private routeStoreService: RouteStoreService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private unreadActionsStoreService: UnreadActionsStoreService,
    private messageService: MessageService,
    private ts: TranslocoService,
    private loggingService: LoggingService,
  ) {}

  @Action(LoadFindingDetails)
  loadFindingDetails(ctx: StateContext<FindingDetailsStateModel>) {
    return this.routeStoreService.getPathParamByKey('findingId').pipe(
      switchMap((findingId: string) =>
        forkJoin({
          findingDetails:
            this.findingDetailsService.getFindingDetails(findingId),
          manageFindingDetails:
            this.findingDetailsService.getManageFindingDetails(findingId),
        }),
      ),
      tap(({ findingDetails, manageFindingDetails }) => {
        const mappedFindingDetails =
          FindingDetailsMapperService.mapToFindingDetailsModel(
            findingDetails,
            manageFindingDetails,
          );

        if (mappedFindingDetails) {
          ctx.dispatch(new LoadFindingDetailsSuccess(mappedFindingDetails));
        }
      }),
    );
  }

  @Action(LoadFindingDetailsSuccess)
  loadFindingDetailsSuccess(
    ctx: StateContext<FindingDetailsStateModel>,
    { findingDetails }: LoadFindingDetailsSuccess,
  ): void {
    ctx.patchState({ findingDetails });
    ctx.dispatch(new LoadLatestFindingResponses());
    ctx.dispatch(new LoadResponseFindingsHistory());
  }

  @Action(ChangeFindingDetailsLanguage)
  changeFindingDetailsLanguage(
    ctx: StateContext<FindingDetailsStateModel>,
    { selectedLanguage }: ChangeFindingDetailsLanguage,
  ): void {
    const state = ctx.getState();
    const { primaryLanguageDescription, secondaryLanguageDescription } =
      state.findingDetails;

    if (primaryLanguageDescription && secondaryLanguageDescription) {
      const updatedFindingDetails = {
        ...state.findingDetails,
        primaryLanguageDescription: {
          ...primaryLanguageDescription,
          isSelected: primaryLanguageDescription.language === selectedLanguage,
        },
        secondaryLanguageDescription: {
          ...secondaryLanguageDescription,
          isSelected:
            secondaryLanguageDescription.language === selectedLanguage,
        },
      };

      ctx.patchState({ findingDetails: updatedFindingDetails });
    }
  }

  @Action(SendFindingResponsesForm)
  sendFindingResponsesForm(
    ctx: StateContext<FindingDetailsStateModel>,
    { submitModel }: SendFindingResponsesForm,
  ) {
    const state = ctx.getState();
    const { findingNumber } = state.findingDetails;
    const responseId = state.latestFindingResponses?.respondId;
    const dto = FindingDetailsMapperService.mapToFindingResponsesPayloadDto(
      submitModel,
      findingNumber,
      responseId,
    );

    ctx.dispatch(new SwitchIsRespondInProgress(true));

    return this.findingDetailsService.respondToFindings(dto).pipe(
      tap((result: any) => {
        if (result.data.postLatestFindingResponse?.isSuccess) {
          this.loggingService.logEvent('Finding_Response_Submit_Success', {
            findingNumber,
            responseId,
            timestamp: new Date().toISOString(),
          });
          ctx.dispatch(
            new SendFindingResponsesFormSuccess(dto.request.isSubmitToDnv),
          );
          this.unreadActionsStoreService.loadUnreadActions();
        } else {
          this.loggingService.logEvent('Finding_Response_Submit_Failed', {
            findingNumber,
            responseId,
            error:
              result.data.postLatestFindingResponse?.message ||
              'Error during finding response submission',
            timestamp: new Date().toISOString(),
          });
          ctx.dispatch(new SwitchIsRespondInProgress(false));
        }
      }),
      catchError((error) => {
        this.loggingService.logEvent('Finding_Response_Submit_Failed', {
          findingNumber,
          responseId,
          error: error?.message || error,
          timestamp: new Date().toISOString(),
        });

        ctx.dispatch(new SwitchIsRespondInProgress(false));

        throw error;
      }),
    );
  }

  @Action(SendFindingResponsesFormSuccess)
  sendFindingRespondFormSuccess(
    ctx: StateContext<FindingDetailsStateModel>,
    action: SendFindingResponsesFormSuccess,
  ) {
    const message = getToastContentBySeverity(ToastSeverity.Success);

    const translationKey = (() => {
      if (action.isSubmitToDnv) {
        return 'findings.findingDetails.responsesSendToDNVSuccess';
      }

      return 'findings.findingDetails.responsesSaveAsDraftSuccess';
    })();

    message.summary = this.ts.translate(translationKey);
    this.messageService.add(message);

    ctx.dispatch(new LoadLatestFindingResponses());
    ctx.dispatch(new LoadResponseFindingsHistory());
  }

  @Action(SetIsFindingResponseFormDirtyFlag)
  setIsFindingResponseFormDirtyFlag(
    ctx: StateContext<FindingDetailsStateModel>,
    { isFindingResponseFormDirty }: SetIsFindingResponseFormDirtyFlag,
  ) {
    ctx.patchState({
      isFindingResponseFormDirty,
    });
  }

  @Action(LoadLatestFindingResponses)
  loadLatestFindingResponses(ctx: StateContext<FindingDetailsStateModel>) {
    const state = ctx.getState();
    const { findingNumber } = state.findingDetails;

    return this.findingDetailsService
      .getLatestFindingResponses(findingNumber)
      .pipe(
        tap((response) => {
          const model =
            FindingDetailsMapperService.mapToFindingResponsesModel(response);
          ctx.dispatch(new LoadLatestFindingResponsesSuccess(model));
        }),
      );
  }

  @Action(LoadLatestFindingResponsesSuccess)
  loadLatestFindingResponsesSuccess(
    ctx: StateContext<FindingDetailsStateModel>,
    {
      latestFindingResponses: respondToFinding,
    }: LoadLatestFindingResponsesSuccess,
  ) {
    ctx.patchState({
      latestFindingResponses: respondToFinding,
    });
    ctx.dispatch(new SwitchIsRespondInProgress(false));
  }

  @Action(SwitchIsRespondInProgress)
  switchIsRespondInProgress(
    ctx: StateContext<FindingDetailsStateModel>,
    { isRespondInProgress }: SwitchIsRespondInProgress,
  ) {
    ctx.patchState({
      isRespondInProgress,
    });
  }

  @Action(LoadResponseFindingsHistory)
  loadResponseFindingsHistory(ctx: StateContext<FindingDetailsStateModel>) {
    const state = ctx.getState();

    const { findingNumber } = state.findingDetails;

    return this.findingResponseHistory
      .getFindingResponseHistory(findingNumber)
      .pipe(
        tap((response) => {
          const model =
            FindingResponseHistoryMapperService.mapToFindingResponseHistoryModel(
              response,
            );

          if (model) {
            ctx.dispatch(new LoadResponseFindingsHistorySuccess(model));
          }
        }),
      );
  }

  @Action(LoadResponseFindingsHistorySuccess)
  loadResponseFindingsHistorySuccess(
    ctx: StateContext<FindingDetailsStateModel>,
    { responseHistory }: LoadResponseFindingsHistorySuccess,
  ) {
    ctx.patchState({
      responseHistory,
    });
  }

  @Action(LoadFindingDocumentsList)
  loadFindingDocumentsList(ctx: StateContext<FindingDetailsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      documents: {
        ...state.documents,
        loading: true,
      },
    });
    const { findingNumber, header } = state.findingDetails;
    const hasFindingsEditPermission = this.profileStoreService.hasPermission(
      PermissionCategories.Findings,
      PermissionsList.Edit,
    )();

    const isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser();

    return this.findingDocumentsListService
      .getFindingDocumentsList(header.auditNumber, findingNumber)
      .pipe(
        throwIfNotSuccess(),
        tap((findingListDto) => {
          const findingDocuments =
            FindingDocumentsListMapperService.mapToFindingDocumentItemModel(
              findingListDto,
              hasFindingsEditPermission,
              isDnvUser,
            );

          ctx.dispatch(new LoadFindingDocumentsListSuccess(findingDocuments));

          ctx.dispatch(new UpdateDocumentFilterOptions(findingDocuments));
        }),
        catchError(() => ctx.dispatch(new LoadFindingDocumentsListFail())),
      );
  }

  @Action(LoadFindingDocumentsListSuccess)
  loadFindingDocumentsListSuccess(
    ctx: StateContext<FindingDetailsStateModel>,
    { documentsList }: LoadFindingDocumentsListSuccess,
  ) {
    ctx.patchState({
      documents: {
        error: '',
        list: documentsList,
        loading: false,
      },
    });
  }

  @Action(LoadFindingDocumentsListFail)
  loadFindingDocumentsListFail(ctx: StateContext<any>) {
    ctx.patchState({
      documents: {
        error: 'Failed to load finding document List data',
        list: [],
        loading: false,
      },
    });
  }

  @Action(UpdateDocumentGridConfig)
  updateDocumentGridConfig(
    ctx: StateContext<FindingDetailsStateModel>,
    { gridConfig }: UpdateDocumentGridConfig,
  ): void {
    ctx.patchState({ gridConfig });
  }

  @Action(UpdateDocumentFilterOptions)
  updateDocumentFilterOptions(
    ctx: StateContext<FindingDetailsStateModel>,
    { documentsList }: UpdateDocumentFilterOptions,
  ): void {
    const filterOptions = {
      fileType: getFilterOptionsForColumn(documentsList, 'fileType'),
      uploadedBy: getFilterOptionsForColumn(documentsList, 'uploadedBy'),
      fileName: getFilterOptionsForColumn(documentsList, 'fileName'),
    };

    ctx.patchState({ filterOptions });
  }

  @Action(ResetFindingDetailsState)
  resetFindingDetailsState(ctx: StateContext<FindingDetailsStateModel>) {
    ctx.setState(defaultState);
  }
}

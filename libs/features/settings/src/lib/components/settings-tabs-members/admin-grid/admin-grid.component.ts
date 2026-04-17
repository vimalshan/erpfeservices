import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { ofActionCompleted } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { combineLatest, filter, map, switchMap, take, tap } from 'rxjs';

import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import {
  ProfileLanguageStoreService,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import { UpdateImpersonatedUser } from '@customer-portal/data-access/settings/state/actions';
import { SettingsMembersStoreService } from '@customer-portal/data-access/settings/state/store-services';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import { buttonStyleClass } from '@customer-portal/shared/components/custom-confirm-dialog';
import { GridComponent } from '@customer-portal/shared/components/grid';
import {
  AppPagesEnum,
  modalBreakpoints,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared/constants';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers';
import {
  ColumnDefinition,
  GridConfig,
  GridEventAction,
  GridEventActionType,
  ToastSeverity,
} from '@customer-portal/shared/models';
import { CoBrowsingSharedService } from '@customer-portal/shared/services/co-browsing';

import { MEMBERS_LIST_COLUMNS } from '../../../constants';
import {
  ManagePermissionsModalComponent,
  ManagePermissionsModalFooterComponent,
} from '../manage-permissions-modal';

@Component({
  selector: 'lib-admin-grid',
  imports: [CommonModule, GridComponent],
  templateUrl: './admin-grid.component.html',
  styleUrl: './admin-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGridComponent
  extends BasePreferencesComponent
  implements OnInit, OnDestroy
{
  public shouldPersist = input<boolean>(true);
  public isDnvUser = input<boolean>(false);
  cols: ColumnDefinition[] = MEMBERS_LIST_COLUMNS;
  ref: DynamicDialogRef | undefined;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.settingsMembersStoreService.loadSettingsAdminList();
    }),
  );

  constructor(
    public settingsMembersStoreService: SettingsMembersStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private dialogService: DialogService,
    private translocoService: TranslocoService,
    private confirmationService: ConfirmationService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private profileStoreService: ProfileStoreService,
    private settingsCompanyDetailsStoreService: SettingsCompanyDetailsStoreService,
    private router: Router,
    private messageService: MessageService,
    private coBrowsingSharedService: CoBrowsingSharedService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
  ) {
    super();
    this.settingsMembersStoreService.loadSettingsAdminList();

    this.initializePreferences(
      PageName.SettingsAdmin,
      ObjectName.Admin,
      ObjectType.Grid,
    );
  }

  ngOnInit(): void {
    this.disableActionsForDNVUser();
  }

  disableActionsForDNVUser(): void {
    this.cols = this.isDnvUser()
      ? this.cols.filter((col) => col.field !== 'eventActions')
      : this.cols;
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.settingsMembersStoreService.updateAdminGridConfig(gridConfig);
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  onEventActionTrigger(data: { event: GridEventAction }): void {
    const { actionType, id } = data.event;

    const handlers: Partial<Record<GridEventActionType, () => void>> = {
      [GridEventActionType.Remove]: () =>
        this.confirmRemoveMember(id as string),
      [GridEventActionType.ManagePermissions]: () =>
        this.handleManagePermissions(id),
      [GridEventActionType.ViewPortalAs]: () => this.viewPortalAs(id as string),
    };

    const handler = handlers[actionType];

    if (handler) {
      handler();
    }
  }

  handleManagePermissions(id: string | number): void {
    this.dialogService
      .open(ManagePermissionsModalComponent, {
        header: this.translocoService.translate(
          'settings.membersTab.managePermissions',
        ),
        width: '50vw',
        contentStyle: { overflow: 'auto', padding: '0' },
        breakpoints: modalBreakpoints,
        data: {
          showBackBtn: false,
          memberEmail: id,
          isAdmin: true,
        },
        templates: {
          footer: ManagePermissionsModalFooterComponent,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((data: boolean) => {
        if (data) {
          this.settingsMembersStoreService.submitManageMembersPermissions();
        } else {
          this.settingsMembersStoreService.discardMemberPermissionsDataAndCompanies();
          this.settingsMembersStoreService.discardMemberPermissionsUserSelection();
        }
      });
  }

  ngOnDestroy(): void {
    this.settingsMembersStoreService.resetAdminListState();
  }

  private confirmRemoveMember(memberEmail: string): void {
    this.confirmationService.confirm({
      header: this.translocoService.translate(
        'settings.membersTab.removeUser.header',
      ),
      message: this.translocoService.translate(
        'settings.membersTab.removeUser.message',
      ),
      acceptLabel: this.translocoService.translate(
        'settings.membersTab.removeUser.yes',
      ),
      rejectLabel: this.translocoService.translate(
        'settings.membersTab.removeUser.no',
      ),
      acceptButtonStyleClass: [
        buttonStyleClass.noIcon,
        buttonStyleClass.danger,
      ].join(' '),
      rejectButtonStyleClass: [
        buttonStyleClass.noIcon,
        buttonStyleClass.outlined,
      ].join(' '),
      accept: () => {
        this.settingsMembersStoreService.removeMember(memberEmail);
      },
    });
  }

  @HostBinding('class.persist') get persistClass() {
    return this.shouldPersist();
  }

  private viewPortalAs(memberEmail: string) {
    this.settingsCoBrowsingStoreService.updateImpersonatedUser(memberEmail);
    this.profileStoreService.resetProfileLoadAndErrorState();
    this.settingsCompanyDetailsStoreService.resetCompanyLoadAndErrorState();
    this.globalSiteMasterStoreService.resetSiteMasterState();
    this.globalServiceMasterStoreService.resetServiceMasterState();

    this.actions$
      .pipe(
        ofActionCompleted(UpdateImpersonatedUser),
        take(1),
        switchMap(() => {
          this.loadInitialData();

          return this.checkLoadedStates().pipe(
            switchMap(() => this.checkErrors()),
            tap((success) => {
              if (success) {
                this.coBrowsingSharedService.setCoBrowsingUserEmail(
                  memberEmail,
                );
                this.router.navigate([AppPagesEnum.Overview], {});
              } else {
                this.messageService.add(
                  getToastContentBySeverity(ToastSeverity.InitializationError),
                );
                this.settingsCoBrowsingStoreService.updateImpersonatedUser(
                  null,
                );
              }
            }),
          );
        }),
      )
      .subscribe();
  }

  private loadInitialData(): void {
    this.profileStoreService.loadProfileData();
    this.profileLanguageStoreService.loadProfileLanguage();
    this.settingsCompanyDetailsStoreService.loadSettingsCompanyDetails();
    this.globalSiteMasterStoreService.loadGlobalSiteMasterList();
    this.globalServiceMasterStoreService.loadGlobalServiceMasterList();
  }

  private checkLoadedStates() {
    const loadedStates$ = {
      profileLoaded: this.profileStoreService.profileDataLoaded$,
      languageLoaded:
        this.profileLanguageStoreService.profileLanguageDataLoaded$,
      companyLoaded: this.settingsCompanyDetailsStoreService.companyDataLoaded$,
      siteLoaded: this.globalSiteMasterStoreService.siteMasterLoaded$,
      serviceLoaded: this.globalServiceMasterStoreService.serviceMasterLoaded$,
    };

    return combineLatest(loadedStates$).pipe(
      filter((states) => Object.values(states).every(Boolean)),
      take(1),
      map(() => true),
    );
  }

  private checkErrors() {
    const errorStates$ = {
      profileError: this.profileStoreService.profileDataError$,
      languageError: this.profileLanguageStoreService.profileDataLanguageError$,
      companyError:
        this.settingsCompanyDetailsStoreService.companyDetailsError$,
      siteError: this.globalSiteMasterStoreService.siteMasterLoadingError$,
      serviceError:
        this.globalServiceMasterStoreService.serviceMasterLoadingError$,
    };

    return combineLatest(errorStates$).pipe(
      take(1),
      map((errors) => !Object.values(errors).some((err) => !!err)),
    );
  }
}

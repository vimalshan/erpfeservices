import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, Observable } from 'rxjs';

import { LoggingService } from '@customer-portal/core';
import {
  DownloadFileNames,
  DownloadType,
  DownloadTypeName,
} from '@customer-portal/data-access/documents';
import { DocumentQueueService } from '@customer-portal/data-access/documents/services';
import {
  FindingsListMapperService,
  FindingsListService,
  FindingsListStoreService,
} from '@customer-portal/data-access/findings';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import { GridComponent } from '@customer-portal/shared/components/grid';
import {
  FINDINGS_STATUS_STATES_MAP,
  FINDINGS_TAG_STATES_MAP,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared/constants';
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import { ColumnDefinition, GridConfig } from '@customer-portal/shared/models';

import { FINDINGS_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-finding-list',
  imports: [CommonModule, GridComponent],
  providers: [FindingsListStoreService],
  templateUrl: './finding-list.component.html',
  styleUrl: './finding-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingListComponent
  extends BasePreferencesComponent
  implements OnInit, OnDestroy
{
  private _preferenceLoaded = signal(false);
  @ViewChild('grid') gridComponent!: GridComponent;

  get preferenceLoadedSignal() {
    return this._preferenceLoaded;
  }

  tagStatesMap = FINDINGS_TAG_STATES_MAP;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  cols: ColumnDefinition[] = FINDINGS_LIST_COLUMNS;

  isReadyToRender = computed(
    () =>
      this.preferenceLoadedSignal() && this.findingsListStoreService.loaded(),
  );

  constructor(
    public findingsListStoreService: FindingsListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private findingsListService: FindingsListService,
    private documentQueueService: DocumentQueueService,
    private loggingService: LoggingService,
  ) {
    super();
    this.initializePreferences(
      PageName.FindingList,
      ObjectName.Findings,
      ObjectType.Grid,
    );
  }

  ngOnInit(): void {
    this.findingsListStoreService.applyNavigationFiltersFromOverview();
    this.registerDownloadHandlers();

    this.findingsListStoreService.loadFindingsList();

    this.preferenceDataLoaded
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        if (v) {
          this._preferenceLoaded.set(true);
        }
      });
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.findingsListStoreService.updateGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    const filterConfig = {
      ...this.findingsListStoreService.filteringConfigSignal(),
    };
    const payload =
      FindingsListMapperService.mapToFindingExcelPayloadDto(filterConfig);

    this.documentQueueService.addDownloadTask(
      DownloadType.FindingExcel,
      DownloadTypeName.FindingExcel,
      DownloadFileNames.FindingExcel,
      { payload },
    );

    const exportBtnEl = this.gridComponent.getExportButtonElement();

    if (exportBtnEl) {
      animateFlyToDownload(exportBtnEl);
    }
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  ngOnDestroy(): void {
    this.findingsListStoreService.resetFindingsListState();
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.FindingExcel,
      this.createFindingExcelExportHandler(),
    );
  }

  private createFindingExcelExportHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.findingsListService.exportFindingsExcel(data.payload, true).pipe(
        map((input) => {
          const result = {
            blob: new Blob([new Uint8Array(input)], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            fileName: fileName || DownloadFileNames.FindingExcel,
          };
          this.loggingService.logEvent('Findings_Export_Excel_Success', {
            fileName: result.fileName,
            timestamp: new Date().toISOString(),
          });

          return result;
        }),
        catchError((error) => {
          this.loggingService.logEvent('Findings_Export_Excel_Failed', {
            error: error?.message || error,
            timestamp: new Date().toISOString(),
          });
          throw error;
        }),
      );
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';

import { SpinnerService } from '@customer-portal/core';
import { FindingDetailsStoreService } from '@customer-portal/data-access/findings';
import { StatusComponent } from '@customer-portal/shared/components/grid';
import { FINDINGS_STATUS_STATES_MAP } from '@customer-portal/shared/constants';
import { CustomDatePipe } from '@customer-portal/shared/pipes/custom-date.pipe';

import { FindingTabViewComponent } from '../finding-tab-view/finding-tab-view.component';

@Component({
  selector: 'lib-finding-details',
  imports: [
    CommonModule,
    StatusComponent,
    TranslocoDirective,
    FindingTabViewComponent,
    RouterModule,
    CustomDatePipe,
  ],
  providers: [FindingDetailsStoreService],
  templateUrl: './finding-details.component.html',
  styleUrls: ['./finding-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingDetailsComponent implements OnDestroy {
  findingDetails = this.findingDetailsStoreService.findingDetails;
  isFindingResponseFormDirty$ =
    this.findingDetailsStoreService.isFindingResponseFormDirty;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  isLoading = this.spinnerService.isLoading$;

  constructor(
    public findingDetailsStoreService: FindingDetailsStoreService,
    public confirmationService: ConfirmationService,
    private spinnerService: SpinnerService,
  ) {
    this.findingDetailsStoreService.loadFindingDetails();
  }

  get findingId(): string {
    return this.findingDetailsStoreService.findingId();
  }

  ngOnDestroy(): void {
    this.findingDetailsStoreService.resetFindingDetailsState();
  }
}

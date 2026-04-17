import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';

import { TrainingStatusStoreService } from '@customer-portal/data-access/overview';
import { environment } from '@customer-portal/environments';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';

@Component({
  selector: 'lib-overview-training-status',
  imports: [
    CommonModule,
    SharedButtonComponent,
    TranslocoDirective,
    CardModule,
  ],
  providers: [TrainingStatusStoreService],
  templateUrl: './overview-training-status.component.html',
  styleUrl: './overview-training-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewTrainingStatusComponent implements OnInit {
  trainingStatusCount = 2;
  sharedButtonType = SharedButtonType;

  constructor(public trainingStatusStoreService: TrainingStatusStoreService) {}

  ngOnInit(): void {
    this.trainingStatusStoreService.loadTrainingStatus();
  }

  onButtonClick(): void {
    this.trainingStatusStoreService.redirectToLms(environment.lmsUrl);
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';

import {
  FindingDetailsDescription,
  FindingDetailsStoreService,
  FindingResponsesModel,
} from '@erp-services/data-access/findings';
import { TagComponent } from '@erp-services/shared/components/grid';
import { LanguageSwitcherComponent } from '@erp-services/shared/components/language-switcher';
import { FINDINGS_TAG_STATES_MAP } from '@erp-services/shared/constants';
import { LanguageOption } from '@erp-services/shared/models';

import { FindingRespondToComponent } from '../finding-respond-to/finding-respond-to.component';

@Component({
  selector: 'lib-finding-manage-content',
  imports: [
    CommonModule,
    TranslocoDirective,
    TagComponent,
    LanguageSwitcherComponent,
    FindingRespondToComponent,
  ],
  templateUrl: './finding-manage-content.component.html',
  styleUrl: './finding-manage-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingManageContentComponent {
  tagStatesMap = FINDINGS_TAG_STATES_MAP;

  get languages(): LanguageOption[] {
    return this.findingDetailsStoreService.languageOptions() ?? [];
  }

  get details(): Signal<FindingDetailsDescription | undefined> {
    return this.findingDetailsStoreService.findingDetailsDescription;
  }

  constructor(
    public findingDetailsStoreService: FindingDetailsStoreService,
    public confirmationService: ConfirmationService,
  ) {}

  onSendForm(event: FindingResponsesModel): void {
    this.findingDetailsStoreService.sendFindingResponsesForm(event);
    this.findingDetailsStoreService.setIsFindingResponseFormDirtyFlag(false);
  }

  onSelectedLanguageChanged(language: string): void {
    this.findingDetailsStoreService.changeFindingDetailsLanguage(language);
  }

  onFormDirtyStateChanged(event: boolean): void {
    this.findingDetailsStoreService.setIsFindingResponseFormDirtyFlag(event);
  }
}

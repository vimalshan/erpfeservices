import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { SelectModule } from 'primeng/select';

import { LanguageOption } from '../../models';

@Component({
  selector: 'shared-language-switcher',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SelectModule,
    TranslocoDirective,
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  @Input()
  languages: LanguageOption[] = [];
  selectedLanguage = {
    language: 'English',
    isSelected: true,
  };

  @Output() selectedLanguageChanged = new EventEmitter<string>();

  selectLanguage(language: string): void {
    this.selectedLanguageChanged.emit(language);
  }
}

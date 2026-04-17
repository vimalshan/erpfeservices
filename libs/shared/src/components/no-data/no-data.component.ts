import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'shared-no-data',
  standalone: true,
  imports: [CommonModule, TranslocoDirective],
  template: `
    <ng-container *transloco="let t">
      <div class="no-data" [class.no-data--error]="error">
        <i class="pi" [ngClass]="error ? 'pi-exclamation-triangle' : 'pi-inbox'" class="no-data__icon"></i>
        <p *ngIf="infoText" class="no-data__info">{{ infoText }}</p>
        <p *ngIf="altText" class="no-data__text">{{ altText }}</p>
        <p *ngIf="descriptionText" class="no-data__description">{{ descriptionText }}</p>
        <p *ngIf="!infoText && !altText && message" class="no-data__text">{{ message || t('noDataAvailable') }}</p>
      </div>
    </ng-container>
  `,
  styles: [`
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: var(--p-text-secondary-color, #6b7280);
    }
    .no-data__icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .no-data__text, .no-data__info {
      margin: 0;
      font-size: 0.875rem;
    }
    .no-data__description {
      margin: 0.25rem 0 0;
      font-size: 0.75rem;
      opacity: 0.7;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoDataComponent {
  @Input() message = '';
  @Input() altText = '';
  @Input() descriptionText = '';
  @Input() infoText = '';
  @Input() error = false;
}

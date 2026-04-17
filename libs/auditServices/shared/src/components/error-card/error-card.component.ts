import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'shared-error-card',
  standalone: true,
  template: `
    <div class="error-card">
      <div class="error-card__icon">
        <i class="pi pi-exclamation-triangle"></i>
      </div>
      @if (title) {
        <h2 class="error-card__title">{{ title }}</h2>
      }
      @if (description) {
        <p class="error-card__description">{{ description }}</p>
      }
    </div>
  `,
  styles: [`
    .error-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem;
    }
    .error-card__icon {
      font-size: 3rem;
      color: var(--p-red-500, #ef4444);
      margin-bottom: 1rem;
    }
    .error-card__title {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .error-card__description {
      margin: 0;
      color: var(--p-text-secondary-color, #6b7280);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorCardComponent {
  @Input() title = '';
  @Input() description = '';
}

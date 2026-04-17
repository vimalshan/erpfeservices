import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { TabsModule } from 'primeng/tabs';

export { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'shared-tabs',
  imports: [CommonModule, TabsModule],
  templateUrl: './custom-tabs.component.html',
  styleUrl: './custom-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTabsComponent {
  public value = input<string>('0');
  public styleClass = input<string>('');
  public scrollable = input<boolean>(false);
}

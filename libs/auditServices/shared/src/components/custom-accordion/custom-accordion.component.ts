import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

export { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'shared-accordion',
  imports: [CommonModule, AccordionModule],
  templateUrl: './custom-accordion.component.html',
  styleUrl: './custom-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccordionComponent {
  public value = input<string | string[]>();
  public multiple = input<boolean>(false);
  public styleClass = input<string>();
}

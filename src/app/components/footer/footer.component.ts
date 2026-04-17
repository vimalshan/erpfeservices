import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

interface LinkModel {
  url: string;
  label: string;
  icon?: string;
}
@Component({
  selector: 'erp-services-footer',
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  footerLeftLinks: LinkModel[] = [
    {
      url: 'https://www.suaadhya.com/assurance',
      label: 'footer.aboutUs',
    },
    {
      url: 'https://www.suaadhya.com/privacy/',
      label: 'footer.privacyStatement',
    },
    {
      url: 'https://www.suaadhya.com/terms/',
      label: 'footer.termsOfUse',
    },
  ];

  footerRightLinks: LinkModel[] = [
    {
      url: 'https://www.linkedin.com/showcase/suaadhya-assurance',
      label: 'footer.linkedin',
      icon: 'pi pi-linkedin',
    },
    {
      url: 'https://www.suaadhya.com/system/copyright/',
      label: 'footer.copyright',
    },
  ];
}

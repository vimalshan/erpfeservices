import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { environment } from '@erp-services/environments';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@erp-services/shared/components/button';
import { AuthService } from '@erp-services/shared/services';

@Component({
  selector: 'erp-services-logout',
  imports: [CommonModule, SharedButtonComponent, TranslocoDirective],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {
  suaadhyaLink = environment.suaadhyaLink;
  sharedButtonType = SharedButtonType;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.resetLogoutState();
  }

  onLoginClick(): void {
    this.authService.login();
  }

  onGoToSuaadhyaClick(): void {
    window.open(this.suaadhyaLink, '_self');
  }
}

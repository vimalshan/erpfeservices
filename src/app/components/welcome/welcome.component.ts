import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  SharedButtonComponent,
  SharedButtonType,
} from '@erp-services/shared/components/button';
import { ErrorCardComponent } from '@erp-services/shared/components/error-card';
import { AuthService } from '@erp-services/shared/services/auth';

@Component({
  selector: 'erp-services-welcome',
  imports: [
    CommonModule,
    SharedButtonComponent,
    TranslocoDirective,
    ErrorCardComponent,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  isUserValidated?: boolean;
  sharedButtonType = SharedButtonType;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.isUserValidated = window.history.state?.isUserValidated;
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }
}

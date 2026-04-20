import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { environment } from '@erp-services/environments';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@erp-services/shared/components/button';
import { AuthServiceWithCookies } from '../../services/auth-with-cookies.service';

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

  constructor(
    private readonly authService: AuthServiceWithCookies,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Clear all authentication cookies and redirect to login
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still clear local auth state even if server logout fails
        this.authService.resetLogoutState();
        this.router.navigate(['/login']);
      }
    });
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  onGoToSuaadhyaClick(): void {
    window.open(this.suaadhyaLink, '_self');
  }
}

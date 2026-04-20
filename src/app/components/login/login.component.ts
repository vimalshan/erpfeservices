import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthServiceWithCookies } from '../../services/auth-with-cookies.service';
import { LoginRequest, LoginResponse, LocalAuthService } from '@erp-services/shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    usernameOrEmail: '',
    password: ''
  };

  isLogging = false;
  loginError = '';
  loginSuccess = false;

  constructor(
    private authService: AuthServiceWithCookies,
    private localAuthService: LocalAuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.isLogging = true;
    this.loginError = '';
    this.loginSuccess = false;

    // Step 1: POST /api/v1/Auth/login → get tokens (saved to cookies)
    // Step 2: GET /api/v1/Auth/me → validate token & get user info
    // Step 3: Redirect to /dashboard
    this.authService.loginWithCredentials(this.loginRequest).pipe(
      switchMap((response: LoginResponse) => {
        // Store tokens in cookies (not localStorage)
        this.authService.storeLoginResponse(response);
        this.authService.storeLoginCredentials(this.loginRequest);
        // Validate token by calling /me
        return this.authService.getMe();
      })
    ).subscribe({
      next: (user) => {
        console.log('Login successful, user:', user);

        // Mark as authenticated so authGuard allows navigation
        this.localAuthService.setAuthenticated({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.roles?.[0] || 'user'
        });

        this.loginSuccess = true;
        this.isLogging = false;

        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {
        console.error('Login failed:', error);
        this.loginError = 'Login failed. Please check your credentials.';
        this.isLogging = false;
      }
    });
  }
}
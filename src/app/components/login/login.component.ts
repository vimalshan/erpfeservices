import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '@customer-portal/shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onLogin()">
        <div>
          <label for="userName">Username:</label>
          <input 
            type="email" 
            id="userName" 
            [(ngModel)]="loginRequest.userName" 
            required
            placeholder="iyyanarmsec@gmail.com"
          />
        </div>
        <div>
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            [(ngModel)]="loginRequest.password" 
            required
            placeholder="HelpMe@&2405"
          />
        </div>
        <div>
          <label for="deviceCode">Device Code:</label>
          <input 
            type="text" 
            id="deviceCode" 
            [(ngModel)]="loginRequest.deviceCode" 
            required
            value="1"
          />
        </div>
        <button type="submit" [disabled]="isLogging">
          {{ isLogging ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div *ngIf="loginError" class="error">
        {{ loginError }}
      </div>
      
      <div *ngIf="loginSuccess" class="success">
        Login successful! Access token received.
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .login-container div {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    
    button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .error {
      color: red;
      margin-top: 10px;
    }
    
    .success {
      color: green;
      margin-top: 10px;
    }
  `]
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    userName: 'iyyanarmsec@gmail.com',
    password: 'HelpMe@&2405',
    deviceCode: '1'
  };
  
  isLogging = false;
  loginError = '';
  loginSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.isLogging = true;
    this.loginError = '';
    this.loginSuccess = false;

    this.authService.loginWithCredentials(this.loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        
        // Store the login response and credentials
        this.authService.storeLoginResponse(response);
        this.authService.storeLoginCredentials(this.loginRequest);
        
        this.loginSuccess = true;
        this.isLogging = false;
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loginError = 'Login failed. Please check your credentials.';
        this.isLogging = false;
      }
    });
  }
}
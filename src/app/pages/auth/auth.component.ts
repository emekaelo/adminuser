import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <h1>Sign Up</h1>
    <form [formGroup]="signUpForm" (submit)="submitSignUpForm()">
      <input type="email" placeholder="email" formControlName="email" />
      <button type="submit">Submit</button>
    </form>

    <h1>Sign In</h1>
    <form [formGroup]="signInForm" (submit)="submitSignInForm()">
      <input type="email" placeholder="email" formControlName="email" />
      <input
        *ngIf="showToken"
        type="text"
        placeholder="temp key"
        formControlName="token"
      />
      <button *ngIf="!showToken" type="submit">Submit</button>
      <button *ngIf="showToken" type="button" (click)="verifyOtp()">
        Verify OTP
      </button>
    </form>
  `,
  styles: '',
})
export class AuthComponent {
  supabaseService = inject(SupabaseService);
  authService = inject(AuthService);
  router = inject(Router);

  signUpForm: FormGroup = inject(FormBuilder).group({
    email: null,
  });

  signInForm: FormGroup = inject(FormBuilder).group({
    email: null,
    token: null,
  });
  showToken: boolean = false;

  async submitSignUpForm() {
    const payload = this.signUpForm.value;
    const { data, error } = await this.supabaseService.createUser(payload);
    if (!error) {
      alert('New user submitted successfully. To be approved by an admin');
    }
  }

  async submitSignInForm() {
    const payload = this.signInForm.value;
    const { data, error } = await this.supabaseService.signIn(payload.email);
    if (!error) {
      this.showToken = true;
      alert('Please check your email for an otp');
    } else {
      alert('User does not exist or has not been approved by an admin');
    }
  }

  async verifyOtp() {
    const payload = this.signInForm.value;
    const {
      data: { session },
      error,
    } = await this.supabaseService.verifyOtp(payload);
    this.authService.saveSessionToLocalStorage(session);
    this.router.navigateByUrl('/users');
  }
}

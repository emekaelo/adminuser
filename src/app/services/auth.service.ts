import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  saveSessionToLocalStorage(session: any) {
    localStorage.setItem('session', JSON.stringify(session));
  }

  removeSessionFromLocalStorage() {
    localStorage.removeItem('session');
  }

  isSignedIn() {
    try {
      return JSON.parse(localStorage.getItem('session') ?? '');
    } catch (error) {
      return null;
    }
  }
}

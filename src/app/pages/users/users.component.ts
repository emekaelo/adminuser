import {Component, inject} from '@angular/core';
import {SupabaseService} from "../../services/supabase.service";
import {NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterOutlet
  ],
  template: `
    <div *ngFor="let user of users; index as i">
      {{ user.email }}
      <ng-container *ngIf="i > 0 && isAdminForEntrySignedIn(i)">
        <button (click)="approveUser(user)" [disabled]="user.isAdmin">Approve{{ user.isAdmin ? 'd' : '' }}</button>
        <button>Update</button>
        <button>Delete</button>
      </ng-container>
    </div><br>

    <ng-container *ngIf="isSignedIn">
      Signed in as {{ isSignedIn?.user?.email }}
      <button (click)="signOut()">Sign Out</button>
    </ng-container>
  `,
  styles: ''
})
export class UsersComponent {
  supabaseService = inject(SupabaseService)
  authService = inject(AuthService)
  router = inject(Router)
  users: any = []
  isSignedIn = this.authService.isSignedIn();

  ngOnInit() {
    this.getUsers();
  }

  async getUsers() {
    const {data, error} = await this.supabaseService.getUsers()
    this.users = data
  }

  async approveUser(user:any) {
    // const {data, error} = await this.supabaseService.sendOTP(user.email);
    const {data, error} = await this.supabaseService.inviteByEmail(user.email);
    // update & set isAdmin to true
    await this.makeUserAdmin(user.id)
  }

  async makeUserAdmin(id: number) {
    const {data, error} = await this.supabaseService.updateUser({isAdmin: true}, id);
    if (!error) {
      alert('user approved successfully')
    }
    await this.getUsers()
  }

  async signOut() {
    const { error } = await this.supabaseService.signOut();
    this.authService.removeSessionFromLocalStorage()
    this.isSignedIn = this.authService.isSignedIn();
    this.router.navigateByUrl('/auth')
  }

  isAdminForEntrySignedIn(index:number) {
    return this.isSignedIn?.user?.email === this.users[index - 1].email
  }
}

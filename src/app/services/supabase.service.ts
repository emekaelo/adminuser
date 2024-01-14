import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );
  private supabaseAdminAuthClient: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseServiceRoleKey
  );

  constructor() {}

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
  }

  verifyOtp(payload: any) {
    return this.supabase.auth.verifyOtp({
      email: payload.email,
      token: payload.token,
      type: 'email',
    });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  getUsers() {
    return this.supabase.from('users').select('*').order('created_at');
  }

  createUser(payload: any) {
    return this.supabaseAdminAuthClient
      .from('users')
      .insert([payload])
      .select();
  }

  updateUser(payload: any, id: number) {
    return this.supabase.from('users').update(payload).eq('id', id).select();
  }

  sendOTP(email: string) {
    return this.supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: 'https://example.com/welcome',
      },
    });
  }

  inviteByEmail(email: string) {
    return this.supabaseAdminAuthClient.auth.admin.inviteUserByEmail(email);
  }
}

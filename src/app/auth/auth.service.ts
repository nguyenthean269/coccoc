import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public id: number;
  public username: string;
  public jwt: string;
  public authorities: string[];
  constructor() {
    this.id = -1;
    this.username = '';
    this.jwt = '';
    this.authorities = [];
  }
}

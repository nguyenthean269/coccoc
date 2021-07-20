import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Authentication {
  id: number;
  username: string;
  jwt: string;
  authorities: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public id: number;
  public username: string;
  public jwt: string;
  public authorities: string[];
  public authenticated: Subject<boolean> = new Subject<boolean>();
  public position: any;
  public allowPosition: any;

  public loginFalse = false;
  public form: FormGroup;
  public visible = false;
  public loginOpen = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notification: NzNotificationService
  ) {
    this.allowPosition = false;
    this.form = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required])
    });
  
    this.id = -1;
    this.username = '';
    this.jwt = '';
    this.authorities = [];
    this.authenticated.next(false);

    if (navigator && navigator.permissions) {
      navigator.permissions.query({name:'geolocation'}).then(result => {
        if (result.state == 'granted') {
          this.allowPosition = true;
          this.getCurrentPosition();
        } else if (result.state == 'prompt') {
          this.allowPosition = false;
          this.getCurrentPosition();
        } else if (result.state == 'denied') {
          this.allowPosition = false;
          this.getCurrentPosition();
        }
        result.onchange = () => {
          if (result.state == 'granted') {
            this.allowPosition = true;
            this.getCurrentPosition();
          } else if (result.state == 'prompt') {
            this.allowPosition = false;
            this.getCurrentPosition();
          } else if (result.state == 'denied') {
            this.allowPosition = false;
            this.getCurrentPosition();
          }
        }
      });
    }
  }

  getCurrentPosition(): void {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        console.log(pos);
        this.position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      }, err => {
        // console.log('err', err);
        this.notification.error('Yêu cầu truy cập vị trí', err.message);
      });
    } else {
      return null;
    } 
  }
  setAuthen(data: Authentication): void {
    /* Lưu trạng thái trên RAM */
    this.id = data.id;
    this.username = data.username;
    this.jwt = data.jwt;
    this.authorities = data.authorities;
    /* Lưu trạng thái trên localStorage */
    try {
      localStorage.setItem('id', String(data.id));
      localStorage.setItem('username', data.username);
      localStorage.setItem('jwt', data.jwt);
      localStorage.setItem('authorities', JSON.stringify(data.authorities));
    } catch(err) {
      console.error('Không setItem được localStorage');
    }
  }
  hasAuthorize(authName: string) {
    if (this.authorities.includes(authName)) {
      return true;
    } else {
      return false;
    }
  }
  setAuthenRAM(data: Authentication): void {
    this.id = data.id;
    this.username = data.username;
    this.jwt = data.jwt;
    this.authorities = data.authorities;
  }

  getAuthen(): Authentication {
    try {
      return {
        id: Number(localStorage.getItem('id')),
        username: localStorage.getItem('username'),
        jwt: localStorage.getItem('jwt'),
        authorities: JSON.parse(localStorage.getItem('authorities'))
      }
    } catch(err) {
      console.error('Không lấy được localStorage');
      return null;
    }
  }

  loging: boolean;
  login(): void {
    this.loginFalse = false;
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    if (this.form.valid) {
      this.loging = true;
      this.http.post<any>(`${environment.api.AUTHENTICATION}`, this.form.value).subscribe(res => {
        if (res.status === 0) {
          this.loginOpen = false;
          this.visible = false;
          this.setAuthen(res.payload.data);
          // this.authService.id = res.payload.data.id;
          // this.authService.username = res.payload.data.username;
          // this.authService.jwt = res.payload.data.jwt;
          // this.authService.authorities = res.payload.data.authorities;
  
          // localStorage.setItem('id', res.payload.data.id);
          // localStorage.setItem('username', res.payload.data.username);
          // localStorage.setItem('jwt', res.payload.data.jwt);
          // localStorage.setItem('authorities', JSON.stringify(res.payload.data.authorities));
        } else {
          this.loginFalse = true;
        }
        this.loging = false;
        console.log(res);
      }, err => {
        this.loging = false;
      });
    }
  }

  logout(): void {
    this.id = -1;
    this.username = '';
    this.jwt = '';
    this.authorities = [];
    try {
      localStorage.removeItem('id');
      localStorage.removeItem('username');
      localStorage.removeItem('jwt');
      localStorage.removeItem('authorities');
    } catch(err) {
      console.error('Không removeItem được localStorage');
    }
  }
}

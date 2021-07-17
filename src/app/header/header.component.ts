import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public visible = false;
  public loginOpen = false;
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public authService: AuthService,
    public mapService: MapService
  ) {
    this.form = this.fb.group({
      username: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  openLoginForm(): void {
    this.loginOpen = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.loginOpen = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.loginOpen = false;
  }
  submitForm(): void {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    this.http.post<any>(`${environment.api.AUTHENTICATION}`, this.form.value).subscribe(res => {
      if (res.status === 0) {
        this.loginOpen = false;
        this.authService.id = res.payload.data.id;
        this.authService.username = res.payload.data.username;
        this.authService.jwt = res.payload.data.jwt;
        this.authService.authorities = res.payload.data.authorities;
      }
      console.log(res);
    });
  }
}

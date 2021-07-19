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
  public showFilter: boolean;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public authService: AuthService,
    public mapService: MapService
  ) {
    
  }

  ngOnInit(): void {
  }

  open(): void {
    this.authService.visible = true;
  }

  close(): void {
    this.authService.visible = false;
  }

  openLoginForm(): void {
    this.authService.loginOpen = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.authService.loginOpen = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.authService.loginOpen = false;
  }

}

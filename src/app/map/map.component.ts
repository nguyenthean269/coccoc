import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { MapService } from './map.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public mapService: MapService
  ) { }

  ngOnInit(): void {
    document.body.style.position = 'fixed';
    document.body.style.top = '0';
    document.body.style.bottom = '0';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.height = `${window.innerHeight}px`;
  }
  handleCancel() {
    this.mapService.viewThuaDat = false;
  }
  handleOk() {
    this.mapService.viewThuaDat = false;
  }
  themDiaChiCancel() {
    this.mapService.themDiaChiPopup = false;
  }
  themDiaChiOk() {
    this.mapService.themDiaChiPopup = false;
  }
}

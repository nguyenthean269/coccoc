import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MapService } from './map.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    public mapService: MapService
  ) { }

  ngOnInit(): void {
    
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

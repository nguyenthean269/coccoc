import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { MapService } from '../map.service';
declare var L: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {

  constructor(
    public mapService: MapService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    this.mapService.layer.backgroundLayer = L.layerGroup();

    this.mapService.layer.wmsLayer = L.layerGroup();
    
    L.gridLayer
    .googlemapcache(environment.api.SERVER_IMG, environment.api.SERVER_GOOGLE_CACHE, 'statellite')
    .addTo(this.mapService.layer.backgroundLayer);
    // L.gridLayer
    // .googlemapcache(environment.api.SERVER_IMG, environment.api.SERVER_GOOGLE_CACHE, 'thua_dat')
    // .addTo(this.mapService.layer.backgroundLayer);
    L.gridLayer
    .googlemapcache(environment.api.SERVER_IMG, environment.api.SERVER_GOOGLE_CACHE, 'label')
    .addTo(this.mapService.layer.backgroundLayer);
    // this.mapService.layer.backgroundLayer.addLayer(this.mapService.layer.backgroundLayer);



    this.mapService.layer.CEN_DA_BO_SUNG = L.layerGroup();
    this.mapService.layer.CHO_BO_SUNG = L.layerGroup();
    this.mapService.layer.DA_BO_SUNG = L.layerGroup();
    this.mapService.layer.DA_PHE_DUYET = L.layerGroup();
    this.mapService.layer.KHONG_DUYET = L.layerGroup();

    this.mapService.layer.rootLayer = L.map(
      'map',
      {
        doubleClickZoom: false,
        // drawControl: true
        layers: [
          this.mapService.layer.backgroundLayer,
          this.mapService.layer.wmsLayer,
          this.mapService.layer.CEN_DA_BO_SUNG,
          this.mapService.layer.CHO_BO_SUNG,
          this.mapService.layer.DA_BO_SUNG,
          this.mapService.layer.DA_PHE_DUYET,
          this.mapService.layer.KHONG_DUYET
        ]
      }
    ).on('moveend', event => {
      // if (this.mapService.allowFitbounds) {
      //   console.log('moveend');
        
      //   this.mapService.allowFitbounds = false;
      if (!this.mapService.allowFitbounds) {
        const bounds = this.mapService.layer.rootLayer.getBounds();
        const cenBounds = leafletBoundsToBounds(bounds);
        this.mapService.formSearch.patchValue({
          southWest: cenBounds.southWest,
          northEast: cenBounds.northEast
        }, {emitEvent: false});
        this.mapService.getAllThuaDat(searchBound(this.mapService.formSearch.value));
      }
      // }
    });

    this.mapService.layer.rootLayer.setView([21.0517479728, 105.8088421389], 18);
    this.mapService.getAllThuaDat(this.mapService.formSearch.value);
  }

  gotoMyLocation(): void {
    this.authService.getCurrentPosition();
    console.log(this.authService.position);
    const bounds = L.latLng(this.authService.position.lat, this.authService.position.lng).toBounds(500);
    const cenBounds = leafletBoundsToBounds(bounds);
    this.mapService.layer.rootLayer.fitBounds(bounds);
    this.mapService.formSearch.patchValue({
      southWest: cenBounds.southWest,
      northEast: cenBounds.northEast
    }, {emitEvent: false});
    this.mapService.getAllThuaDat(searchBound(this.mapService.formSearch.value));

    // this.mapService.layer.rootLayer.setView([this.authService.position.lat, this.authService.position.lng], 18);
  }

}

export function leafletBoundsToBounds(bounds) {
  return {
    northEast: bounds._northEast,
    southWest: bounds._southWest
  }
}
export function leafletBoundsToCenBounds(bounds) {
  return {
      topLeft: {
          lat: bounds._northEast.lat,
          lng: bounds._southWest.lng
      },
      bottomRight: {
          lat: bounds._southWest.lat,
          lng: bounds._northEast.lng
      }
  }
}
export function searchBound(params) {
  const keep = ['northEast', 'southWest', 'trangThaiThuaDat'];
  const newObject = JSON.parse(JSON.stringify(params));
  Object.keys(newObject).forEach(item => {
    if (!keep.includes(item)) {
      delete newObject[item];
    }
  });
  return newObject;
}
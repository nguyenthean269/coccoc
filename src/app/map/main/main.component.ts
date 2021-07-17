import { AfterViewInit, Component, OnInit } from '@angular/core';
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
    public mapService: MapService
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
    this.mapService.layer.DA_BO_SUNG = L.layerGroup();
    this.mapService.layer.DA_PHE_DUYET = L.layerGroup();

    this.mapService.layer.rootLayer = L.map(
      'map',
      {
        doubleClickZoom: false,
        // drawControl: true
        layers: [
          this.mapService.layer.backgroundLayer,
          this.mapService.layer.wmsLayer,
          this.mapService.layer.CEN_DA_BO_SUNG,
          this.mapService.layer.DA_BO_SUNG,
          this.mapService.layer.DA_PHE_DUYET
        ]
      }
    );

    this.mapService.layer.rootLayer.setView([21.0517479728, 105.8088421389], 18);
    this.mapService.getAllThuaDat();
  }

}

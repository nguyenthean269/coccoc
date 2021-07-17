import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../class/address.class';
import { ThuaDat } from './map.model';
declare var L: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public layer: any;
  public formSearch: FormGroup;
  public formAddressAdd: FormGroup;
  public address: any;
  public addressAdd: any;
  public viewThuaDat: boolean;
  public themDiaChiPopup: boolean;
  public thuaDat: ThuaDat;
  constructor(
    public http: HttpClient,
    private fb: FormBuilder
  ) {
    this.layer = {
      rootLayer: null,
      backgroundLayer: null,
      wmsLayer: null,
      CEN_DA_BO_SUNG: null,
      DA_BO_SUNG: null,
      DA_PHE_DUYET: null
    }

    this.address = new Address(this.http);
    this.address.init({
      tinhId: 1
    });

    this.formSearch = this.fb.group({
      duongId: this.fb.control(28899),
      phuongXaId: this.fb.control(null),
      quanId: this.fb.control(null),
      tinhId: this.fb.control(null),
      southWest: this.fb.control(null),
      northEast: this.fb.control(null),
      soNha: this.fb.control(null),
      ngo: this.fb.control(null),
      ngach: this.fb.control(null),
      trangThaiThuaDat: this.fb.control(null),
      userId: this.fb.control(null),
    });

    this.formSearch.get('tinhId').valueChanges.subscribe(tinhId => {
      this.address.selectTinh(tinhId);
    });
    this.formSearch.get('quanId').valueChanges.subscribe(quanHuyenId => {
      this.address.selectQuan(quanHuyenId);
    });
    this.formSearch.get('duongId').valueChanges.subscribe(duongId => {
      this.address.selectDuong(duongId);
    });

    this.formAddressAdd = this.fb.group({
      id: this.fb.control(null),
      fullAddress: this.fb.control(null),
      trangThai: this.fb.control(null),
      latitudeNguoiTao: this.fb.control(null),
      longitudeNguoiTao: this.fb.control(null),
      duongId: this.fb.control(null, [Validators.required]),
      phuongXaId: this.fb.control(null, [Validators.required]),
      thonXomId: this.fb.control(null),
      quanId: this.fb.control(null, [Validators.required]),
      tinhId: this.fb.control(null, [Validators.required]),
      soNha: this.fb.control(null, [Validators.required]),
      ngo: this.fb.control(null),
      ngach: this.fb.control(null)
    });
    this.formAddressAdd.get('tinhId').valueChanges.subscribe(tinhId => {
      this.addressAdd.selectTinh(tinhId);
    });
    this.formAddressAdd.get('quanId').valueChanges.subscribe(quanHuyenId => {
      this.addressAdd.selectQuan(quanHuyenId);
    });
    this.formAddressAdd.get('duongId').valueChanges.subscribe(duongId => {
      this.addressAdd.selectDuong(duongId);
    });

  }
  getAllThuaDat(): void {


    const icon = {
      CEN_DA_BO_SUNG: L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-orange"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      }),
      DA_BO_SUNG: L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-green"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      }),
      DA_PHE_DUYET: L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-blue"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      })
    }
  

    this.layer.CEN_DA_BO_SUNG.clearLayers();
    this.http.post<any>(`${environment.api.GET_ALL_THUA_DAT}`, this.formSearch.value).subscribe(res => {
      console.log(res.payload.data.content);
      const data = res.payload.data.content;
      data.forEach((element: { latitude: any; longitude: any; trangThai: any; id: any; idCen: any }) => {
        L
        .marker([element.latitude, element.longitude], {
          icon: icon[element.trangThai],
          data: {
            mantra: {
              id: element.id,
              idCen: element.idCen
            }
          }
        })
        .addTo(this.layer.CEN_DA_BO_SUNG)
        .on('click', event => {
          this.viewThuaDat = true;
          const id = event.target.options.data.mantra.id;
          const idCen = event.target.options.data.mantra.idCen;
          this.getThuaDat(id);
        });
        // if (element.trangThai === 'CEN_DA_BO_SUNG') {
        //   L.marker([element.latitude, element.longitude], { icon: iconOrange }).addTo(this.layer.CEN_DA_BO_SUNG);
        // } else if (element.trangThai === 'DA_BO_SUNG') {
        //   L.marker([element.latitude, element.longitude], { icon: iconBlue }).addTo(this.layer.CEN_DA_BO_SUNG);
        // } else if (element.trangThai === 'DA_PHE_DUYET') {
        //   L.marker([element.latitude, element.longitude], { icon: iconGreen }).addTo(this.layer.CEN_DA_BO_SUNG);
        // }
        
      });
    });
  }
  getThuaDat(id: number): void {
    this.http.get<any>(`${environment.api.GET_ONE_THUA_DAT}${id}`).subscribe(res => {
      if (res.status === 0) {
        this.thuaDat = res.payload.data;
        console.log(this.thuaDat);
      }
      
    })
  }
  openPopupSuaDiaChi(data): void {
    console.log(data);
    this.themDiaChiPopup = true;
    this.addressAdd = new Address(this.http);
    this.addressAdd.init({
        tinhId: data.tinhId,
        quanHuyenId: data.quanHuyenId,
        phuongXaId: data.phuongXaId,
        thonXomId: data.thonToId,
        duongId: data.duongId,
        ngo: data.ngo,
        ngach: data.ngachHem,
        soNha: data.soNha
    });

    this.formAddressAdd.patchValue({
      id: data.id,
      duongId: data.duongId,
      phuongXaId: data.phuongXaId,
      thonXomId: data.thonToId,
      quanId: data.quanHuyenId,
      tinhId: data.tinhId,
      soNha: data.soNha,
      ngo: data.ngo,
      ngach: data.ngachHem
    }, {emitEvent: false});
    
  }
  openPopupThemDiaChi(): void {
    this.themDiaChiPopup = true;
    this.addressAdd = new Address(this.http);
    this.addressAdd.init({
        tinhId: null,
        quanHuyenId: null,
        phuongXaId: null,
        thonXomId: null,
        duongId: null,
        ngo: null,
        ngach: null,
        soNha: null
    });

    this.formAddressAdd.patchValue({
      id: null,
      duongId: null,
      phuongXaId: null,
      thonXomId: null,
      quanId: null,
      tinhId: null,
      soNha: null,
      ngo: null,
      ngach: null
    }, {emitEvent: false});
  }
  themDiaChi(): void {
    this.thuaDat.diaChis.push(this.formAddressAdd.value);
    this.themDiaChiPopup = false;
  }
  closeThuaDat(): void {
    this.viewThuaDat = false;
  }
}

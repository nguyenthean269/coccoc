import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../class/address.class';
import { ThuaDat } from './map.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../auth/auth.service';

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
  public allowFitbounds: boolean;

  public danhSachCanBo: any;
  public trangThaiThuaDat: any;
  public trangThaiDiaChi: any;
  public loaiCongTrinhs: any;
  public tinhTrangNhas: any;
  constructor(
    public http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService
  ) {
    this.allowFitbounds = true;
    this.layer = {
      rootLayer: null,
      backgroundLayer: null,
      wmsLayer: null,
      CEN_DA_BO_SUNG: null,
      DA_BO_SUNG: null,
      DA_PHE_DUYET: null,
      KHONG_PHE_DUYET: null
    }

    this.http.get<any>(`${environment.api.HTTP_GET_ALL_CAN_BO}`).subscribe(res => {
      this.danhSachCanBo = res.payload.data;
    });
    this.http.get<any>(`${environment.api.HTTP_GET_STATIC_INFO}`).subscribe(res => {
      this.trangThaiThuaDat = res.payload.data.trangThaiThuaDat;
      this.trangThaiDiaChi = res.payload.data.trangThaiDiaChi;
      this.loaiCongTrinhs = res.payload.data.loaiCongTrinhs;
      this.tinhTrangNhas = res.payload.data.tinhTrangNhas;
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

    this.address = new Address(this.http);
    this.address.init({
      tinhId: 1
    }, () => {
      this.address.valueChanges.subscribe(address => {
        console.log('adress change', address);
        this.formSearch.patchValue({
          tinhId: address.tinhThanh.id,
          quanId: address.quanHuyen.id,
          phuongXaId: address.phuongXa.id,
          duongId: address.duongPho.id,
          ngo: address.ngo,
          ngach: address.ngach,
          soNha: address.soNha,
        }, { emitEvent: false });
      });
    });
    

    this.formAddressAdd = this.fb.group({
      id: this.fb.control(null),
      fullAddress: this.fb.control(null),
      thuaDatId: this.fb.control(null),
      trangThai: this.fb.control(null),
      latitudeNguoiTao: this.fb.control(null),
      longitudeNguoiTao: this.fb.control(null),
      duongId: this.fb.control(null, [Validators.required]),
      phuongXaId: this.fb.control(null, [Validators.required]),
      thonXomId: this.fb.control(null),
      quanHuyenId: this.fb.control(null, [Validators.required]),
      tinhId: this.fb.control(null, [Validators.required]),
      tinh: this.fb.control(null, [Validators.required]),
      phuongXa: this.fb.control(null, [Validators.required]),
      quanHuyen: this.fb.control(null, [Validators.required]),
      duong: this.fb.control(null, [Validators.required]),
      soNha: this.fb.control(null, [Validators.required]),
      ngo: this.fb.control(null),
      ngach: this.fb.control(null),
      tinhTrangNha: this.fb.control(null),
      loaiCongTrinhId: this.fb.control(null)
    });
    this.formAddressAdd.get('tinhId').valueChanges.subscribe(tinhId => {
      this.addressAdd.selectTinh(tinhId);
      this.formAddressAdd.patchValue({tinh: this.addressAdd.currentAddress.tinhThanh.ten}, {emitEvent: false});
    });
    this.formAddressAdd.get('quanHuyenId').valueChanges.subscribe(quanHuyenId => {
      this.addressAdd.selectQuan(quanHuyenId);
      this.formAddressAdd.patchValue({quanHuyen: this.addressAdd.currentAddress.quanHuyen.ten}, {emitEvent: false});
    });
    this.formAddressAdd.get('duongId').valueChanges.subscribe(duongId => {
      this.addressAdd.selectDuong(duongId);
      this.formAddressAdd.patchValue({duong: this.addressAdd.currentAddress.duongPho.ten}, {emitEvent: false});
    });
    this.formAddressAdd.get('phuongXaId').valueChanges.subscribe(phuongXaId => {
      this.addressAdd.selectPhuong(phuongXaId);
      this.formAddressAdd.patchValue({phuongXa: this.addressAdd.currentAddress.phuongXa.ten}, {emitEvent: false});
    });

  }

  search(): void {
    this.allowFitbounds = true;
    this.formSearch.patchValue({
      southWest: null,
      northEast: null
    })
    this.getAllThuaDat(this.formSearch.value);
  }
  updateTrangThai($event, data) {
    console.log($event, data);
    this.http.post<any>(`${environment.api.HTTP_THAY_DOI_TRANG_THAI_DIA_CHI}`, {
      id: data.id,
      trangThai: $event
    }).subscribe(res => {
      if (res.status === 0) {
        this.notification.create(
          'success',
          'Thông báo',
          'Cập nhật trạng thái thành công.'
        );
      } else {
        this.notification.create(
          'error',
          'Thông báo',
          `Cập nhật trạng thái thất bại: ${res.description}`
        );
      }
    }, err => {
      this.notification.create(
        'error',
        'Thông báo',
        `Cập nhật trạng thái thất bại: ${err.message}`
      );
    });
  }
  color = ['#0e8028', '#de0c0c', '#ceab00', '#17bd3d', '#696969'];
  createIcon(trangThai, text) {
    const icon = {
      CEN_DA_BO_SUNG: L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-green">${text}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      CHO_BO_SUNG: L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-red">${text}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      DA_BO_SUNG: L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-yellow">${text}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      DA_PHE_DUYET: L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-blue">${text}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      }),
      KHONG_DUYET: L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pink">${text}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    }
    return icon[trangThai];
  }
  getAllThuaDat(params): void {
    this.layer.CEN_DA_BO_SUNG.clearLayers();
    this.layer.CHO_BO_SUNG.clearLayers();
    this.layer.DA_BO_SUNG.clearLayers();
    this.layer.DA_PHE_DUYET.clearLayers();
    this.layer.KHONG_DUYET.clearLayers();

    this.http.post<any>(`${environment.api.GET_ALL_THUA_DAT}`, params).subscribe(res => {
      console.log(res.payload.data.content);
      const data = res.payload.data.content;
      const arrayFitbounds = [];

      if (data && data.length) {
        data.forEach((element: { 
          latitude: any;
          longitude: any;
          trangThai: any;
          id: any;
          idCen: any;
          soNha: any;
          ngachHem: any;
          ngo: any;
        }) => {
          if (this.layer.rootLayer.hasLayer(this.layer[element.trangThai])) {
            const marker = L
            .marker([element.latitude, element.longitude], {
              icon: this.createIcon(
                element.trangThai,
                `${element.soNha ? element.soNha : ''}${element.ngachHem ? ('/' + element.ngachHem) : ''}${element.ngo ? ('/' + element.ngo): ''}`
              ), // icon[element.trangThai],
              data: {
                mantra: {
                  id: element.id,
                  idCen: element.idCen
                }
              }
            })
            .addTo(this.layer[element.trangThai])
            .on('click', event => {
              this.viewThuaDat = true;
              const id = event.target.options.data.mantra.id;
              const idCen = event.target.options.data.mantra.idCen;
              this.getThuaDat(id);
            });
            // marker.bindPopup(`${element.soNha}${element.ngachHem ? ('/' + element.ngachHem) : ''}${element.ngo ? ('/' + element.ngo): ''}`);
            // marker.on('mouseover', function (e) {
            //     this.openPopup();
            // });
            // marker.on('mouseout', function (e) {
            //     this.closePopup();
            // });
    
            arrayFitbounds.push([element.latitude, element.longitude])
            // if (element.trangThai === 'CEN_DA_BO_SUNG') {
            //   L.marker([element.latitude, element.longitude], { icon: iconOrange }).addTo(this.layer.CEN_DA_BO_SUNG);
            // } else if (element.trangThai === 'DA_BO_SUNG') {
            //   L.marker([element.latitude, element.longitude], { icon: iconBlue }).addTo(this.layer.CEN_DA_BO_SUNG);
            // } else if (element.trangThai === 'DA_PHE_DUYET') {
            //   L.marker([element.latitude, element.longitude], { icon: iconGreen }).addTo(this.layer.CEN_DA_BO_SUNG);
            // }
          } else {
            console.log('Loi layer', this.layer[element.trangThai], element.trangThai);
          }        
        });
        this.addWMS(data);
        // console.log('bounds', arrayFitbounds);
        if (this.allowFitbounds) {
          if (arrayFitbounds && arrayFitbounds.length) {
            this.layer.rootLayer.fitBounds(arrayFitbounds, {maxZoom: 17, animate: true, duration: 0.3});
            setTimeout(() => {
              this.allowFitbounds = false;
            }, 800);
          } else {
            this.notification.info('Kết quả tìm kiếm', 'Không tìm thấy thửa đất nào', { nzPlacement: 'bottomRight' });
          }
        }
      } else {
        this.notification.info('Kết quả tìm kiếm', 'Không tìm thấy thửa đất nào', { nzPlacement: 'bottomRight' });
      }
    }, err => {
      this.notification.error('Kết quả tìm kiếm', err.message, { nzPlacement: 'bottomRight' });
    });
  }

  addWMS(data): void {
    this.layer.wmsLayer.clearLayers();
    const phuongXaIdList = [];
    data.forEach(element => {
      if (!phuongXaIdList.includes(element.phuongXaId)) {
        phuongXaIdList.push(element.phuongXaId);
      }
    });
    // console.log('addWMS', data, phuongXaIdList);
    phuongXaIdList.forEach(item => {
      L.gridLayer.googlemapcache(environment.api.SERVER_IMG, environment.api.SERVER_GOOGLE_CACHE, `dcs:new_thua_dat_${item}`)
        .addTo(this.layer.wmsLayer);
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
      quanHuyenId: data.quanHuyenId,
      tinhId: data.tinhId,
      soNha: data.soNha,
      ngo: data.ngo,
      ngach: data.ngachHem,
      tinh: data.tinh,
      phuongXa: data.phuongXa,
      quanHuyen: data.quanHuyen,
      duong: data.duong,
      trangThai: data.trangThai,
      thuaDatId: data.thuaDatId
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
      quanHuyenId: null,
      tinhId: null,
      soNha: null,
      ngo: null,
      ngach: null,
      trangThai: 'CHO_PHE_DUYET',
      thuaDatId: this.thuaDat.id
    }, {emitEvent: false});
  }
  themDiaChi(): void {
    if (!this.formAddressAdd.value.id) {
      this.thuaDat.diaChis.push(this.formAddressAdd.value);
    } else {
      const findIdx = this.thuaDat.diaChis.findIndex(a => a.id === this.formAddressAdd.value.id);
      if (findIdx !== -1) {
        this.thuaDat.diaChis[findIdx] = this.formAddressAdd.value;
      }
    }
    
    this.themDiaChiPopup = false;
  }
  luuCacDiaChi(): void {
    this.thuaDat.diaChis.forEach(item => {
      item.latitudeNguoiTao = this.authService.position.lat,
      item.longitudeNguoiTao = this.authService.position.lng
    });
    this.http.post<any>(`${environment.api.UPDATE_MULTIPLE_THUA_DAT}`, this.thuaDat.diaChis).subscribe(res => {
      if (res.status === 0) {
        this.notification.create(
          'success',
          'Thông báo',
          'Lưu địa chỉ thành công.'
        );
      } else {
        this.notification.create(
          'error',
          'Thông báo',
          res.description
        );
      }
      
    }, error => {
      console.log(error);
      this.notification.create(
        'error',
        'Thông báo',
        'Lưu địa chỉ thành công.'
      );
    });
  }
  closeThuaDat(): void {
    this.viewThuaDat = false;
  }
  xoaDiaChi(index: number): void {
    this.thuaDat.diaChis.splice(index, 1);
  }
}


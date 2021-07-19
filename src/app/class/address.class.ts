/*
Cách sử dụng:

   
*/

import { BehaviorSubject, Subject, zip } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AddressInitParams, AddressListType, AddressType, LevelType } from './address.model';
import { addressInitEmit, loadMap } from './address.const';
import { debounce, debounceTime, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';



export class Address {
    public listSubject: any;
    public initDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // public form: FormGroup;
    public currentId: AddressInitParams;
    public currentAddress: AddressType;
    public valueChanges: BehaviorSubject<AddressType> = new BehaviorSubject<AddressType>(null);
    public danhSach: AddressListType = {
        tinhThanh: [],
        quanHuyen: [],
        phuongXa: [],
        thonXom: [],
        duongPho: [],
        ngo: [],
        ngach: []
    };
    constructor(
        private http: HttpClient
    ) {
        this.initDone.next(false);
        this.currentAddress = addressInitEmit;
        this.valueChanges.next(addressInitEmit);
        
    }
    init(initParams: AddressInitParams, callback?: Function): void {
        this.listSubject = [];
        this.initDone.next(false);
        this.currentId = initParams;
        // this.valueChanges.next({
        //     soNha: this.currentId.soNha,
        //     ngo: this.currentId.ngo,
        //     ngach: this.currentId.ngach,
        //     duongId: this.currentId.duongId,
        //     phuongXaId: this.currentId.phuongXaId,
        //     quanHuyenId: this.currentId.quanHuyenId,
        //     tinhId: this.currentId.tinhId
        // });
        this.currentAddress = {
            soNha: this.currentId.soNha,
            ngo: this.currentId.ngo,
            ngach: this.currentId.ngach,
            duongPho: {
                id: this.currentId.duongId,
                tienTo: null,
                ten: null
            },
            phuongXa: {
                id: this.currentId.phuongXaId,
                tienTo: null,
                ten: null
            },
            thonXom: {
                id: this.currentId.thonXomId,
                tienTo: null,
                ten: null
            },
            quanHuyen: {
                id: this.currentId.quanHuyenId,
                tienTo: null,
                ten: null
            },
            tinhThanh: {
                id: this.currentId.tinhId,
                tienTo: null,
                ten: null
            }
        };
        this.getTinh();
        if (initParams.tinhId) {
            this.getQuan({
                type: "quan",
                idPre: initParams.tinhId
            })
        }
        if (initParams.quanHuyenId) {
            this.getDuong({
                type: "duong",
                idPre: initParams.quanHuyenId
            });
            this.getPhuong({
                type: "phuong",
                idPre: initParams.quanHuyenId
            });
        }
        // if (initParams.tinhId) {
        //     this.getQuan({
        //         type: "quan",
        //         idPre: initParams.tinhId
        //     })
        // }
        if (typeof callback === 'function') {
            callback();
        }
        
    }

    getTinh(): void {
        this.http.post<any>(`${environment.api.HTTP_GET_ADDRESS}`, {type: 'tinh'}).subscribe(res => {
            this.danhSach.tinhThanh = res.payload.data;
        });
    }
    getQuan(params): void {
        this.http.post<any>(`${environment.api.HTTP_GET_ADDRESS}`, params).subscribe(res => {
            this.danhSach.quanHuyen = res.payload.data;
        });
    }
    getPhuong(params): void {
        this.http.post<any>(`${environment.api.HTTP_GET_ADDRESS}`, params).subscribe(res => {
            this.danhSach.phuongXa = res.payload.data;
        });
    }
    getDuong(params): void {
        this.http.post<any>(`${environment.api.HTTP_GET_ADDRESS}`, params).subscribe(res => {
            this.danhSach.duongPho = res.payload.data;
        });
    }
    getNgo(params): void {
        this.http.post<any>(`${environment.api.HTTP_GET_ADDRESS}`, params).subscribe(res => {
            this.danhSach.ngo = res.payload.data;
        });
    }

    getPublicDiaChi(danhSachKey: string, type: string, idPre: number, addParam: string, addValue: string, callback?: Function): void {
        // console.log('addStreetStatus', idPre);
        if (idPre || (addParam && addValue)) {
            const key = `${type}:${idPre || ''}:${addParam || ''}:${addValue || ''}`;
            const data = JSON.parse(sessionStorage.getItem(key));
            // console.log('getAddress', key, data)
            if (data) {
                setTimeout(() => {
                    this.danhSach[danhSachKey] = data;
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, 200);
                
            } else {
                const additionParam = addParam ? `&${addParam}=${addValue}` : ``;
                // console.log('type', idPre);
                const req = this.http.post<any>(`${environment.api.HTTP_GET_ADDRESS}`, {
                    type,
                    idPre: additionParam
                });
                // type=${type}&idPre=${idPre}${additionParam}
                //   this.listSubscribe.push(req);
                req.subscribe(res => {
                    this.danhSach[danhSachKey] = res;
                    if (typeof callback === 'function') {
                        callback();
                    }
                    sessionStorage.setItem(key, JSON.stringify(res));
                });
            }
        } else {
            // idPre null là trường hợp clear selection
            this.danhSach[danhSachKey] = [];
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
    selectTinh(id: number): void {
        this.getQuan({
            type: "quan",
            idPre: id
        });
        const tinhThanh = this.danhSach.tinhThanh.find(a => a.id === id);
        if (tinhThanh) {
            this.currentAddress.tinhThanh = {
                id: id,
                tienTo: tinhThanh.tienTo,
                ten: tinhThanh.ten
            };
        } else {
            this.currentAddress.tinhThanh = {
                id: null,
                tienTo: null,
                ten: null
            };
        }
        this.resetCurrentAddress('quanHuyen');
        this.resetCurrentAddress('phuongXa');
        this.resetCurrentAddress('thonXom');
        this.resetCurrentAddress('duongPho');
        this.resetCurrentAddress('ngo');
        this.resetCurrentAddress('ngach');
        this.resetCurrentAddress('soNha');
        this.valueChanges.next(this.currentAddress);
    }
    selectQuan(id: number): void {
        this.getPhuong({
            type: "phuong",
            idPre: id
        });
        this.getDuong({
            type: "duong",
            idPre: id
        });
        const quanHuyen = this.danhSach.quanHuyen.find(a => a.id === id);
        if (quanHuyen) {
            this.currentAddress.quanHuyen = {
                id: id,
                tienTo: quanHuyen.tienTo,
                ten: quanHuyen.ten
            };
        } else {
            this.currentAddress.quanHuyen = {
                id: null,
                tienTo: null,
                ten: null
            };
        }
        this.resetCurrentAddress('duongPho');
        this.resetCurrentAddress('phuongXa');
        this.valueChanges.next(this.currentAddress);
    }
    selectPhuong(id: number): void {
        this.getPublicDiaChi('thonXom', 'thonxom', id, null, null);
        const phuongXa = this.danhSach.phuongXa.find(a => a.id === id);
        if (phuongXa) {
            this.currentAddress.phuongXa = {
                id: id,
                tienTo: phuongXa.tienTo,
                ten: phuongXa.ten
            };
        } else {
            this.currentAddress.phuongXa = {
                id: null,
                tienTo: null,
                ten: null
            };
        }
        this.resetCurrentAddress('thonXom');
        this.valueChanges.next(this.currentAddress);
    }
    selectDuong(id: number): void {
        this.getNgo({
            type: "ngo",
            idPre: id
        });
        const duongPho = this.danhSach.duongPho.find(a => a.id === id);
        if (duongPho) {
            this.currentAddress.duongPho = {
                id: id,
                tienTo: duongPho.tienTo,
                ten: duongPho.ten
            };
        } else {
            this.currentAddress.duongPho = {
                id: null,
                tienTo: null,
                ten: null
            };
        }
    }
    selectNgo(ngo: string): void {
        this.getPublicDiaChi('ngach', 'ngachhem', this.currentAddress.duongPho.id, 'ngo', ngo);
        this.currentAddress.ngo = ngo;
        this.resetCurrentAddress('ngach');
        this.resetCurrentAddress('soNha');
        this.valueChanges.next(this.currentAddress);
    }
    selectNgach(ngach: string): void {
        this.currentAddress.ngach = ngach;
        this.resetCurrentAddress('soNha');
        this.valueChanges.next(this.currentAddress);
    }
    selectSoNha(soNha: string): void {
        this.currentAddress.soNha = soNha;
        this.valueChanges.next(this.currentAddress);
    }
    setCurrentAddress(level: LevelType, id: number): void {
        const info = this.danhSach[level].find(a => a.id === id);
        if (info) {
            this.currentAddress[level as string] = {
                id: id,
                tienTo: info.tienTo,
                ten: info.ten
            };
        }
    }
    resetCurrentAddress(level: LevelType): void {
        this.danhSach[level] = [];
        if (level === 'ngo' || level === 'ngach' || level === 'soNha') {
            this.currentAddress[level as string] = null;
        } else {
            this.currentAddress[level as string] = {
                id: null,
                tienTo: null,
                ten: null
            };
        }
        
    }

    updateDuongList() {
        const key = `duong:${this.currentAddress.quanHuyen.id}::`;
        sessionStorage.removeItem(key);
        this.getPublicDiaChi('duongPho', 'duong', this.currentAddress.quanHuyen.id, null, null);
        this.resetCurrentAddress('ngo');
        this.resetCurrentAddress('ngach');
        this.resetCurrentAddress('soNha');
    }
    getCurrentTitle(): string {
        // console.log('this.currentAddress', this.currentAddress)
        const string = [];
        ['duongPho', 'phuongXa', 'quanHuyen', 'tinhThanh'].forEach(item => {
            if (this.currentAddress[item].tienTo && this.currentAddress[item].ten) {
                string.push(`${this.currentAddress[item].tienTo} ${this.currentAddress[item].ten}`);
            }
        })
        return string.join(', ');
    }

    patchItem(originObject, newObject) {
        for (let item in newObject) {
            originObject[item] = newObject[item];
        }
        return originObject;
    }
}

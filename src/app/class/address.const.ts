import { AddressType } from './address.model';

export const loadMap = [
    {
        level: 'tinhId',
        key: 'tinhThanh',
        load:[
            { idPre: 'tinhId', type: 'quan', danhSach: 'quanHuyen' }
        ]
    },
    {
        level: 'quanHuyenId',
        key: 'quanHuyen',
        load: [
            { idPre: 'quanHuyenId', type: 'phuong', danhSach: 'phuongXa' },
            { idPre: 'quanHuyenId', type: 'duong', danhSach: 'duongPho' }
        ]
    },
    {
        level: 'phuongXaId',
        key: 'phuongXa',
        load: [
            { idPre: 'phuongXaId', type: 'thonxom', danhSach: 'thonXom' }
        ]
    },
    {
        level: 'duongId',
        key: 'duongPho',
        load: [
            { idPre: 'duongId', type: 'ngo', danhSach: 'ngo' }
        ]
    },
    {
        level: 'ngo',
        key: 'ngo',
        load: [
            { idPre: 'duongId', type: 'ngachhem', danhSach: 'ngach', additionParam: 'ngo', additionValue: 'ngo' }
        ]
    }
];

export const addressInitEmit: AddressType = {
    soNha: null,
    ngo: null,
    ngach: null,
    duongPho: {
        id: null,
        tienTo: null,
        ten: null
    },
    phuongXa: {
        id: null,
        tienTo: null,
        ten: null
    },
    thonXom: {
        id: null,
        tienTo: null,
        ten: null
    },
    quanHuyen: {
        id: null,
        tienTo: null,
        ten: null
    },
    tinhThanh: {
        id: null,
        tienTo: null,
        ten: null
    }
}
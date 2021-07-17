
export class Address {
  id: number;
  phuongId?: number;
  quanId?: number;
  tinhId?: number;
  ten?: string;
  tenDayDu?: string;
  tenKhongDau?: string;
  tienTo?: string;
}
export interface AddressInitParams {
    tinhId: number;
    quanHuyenId?: number;
    phuongXaId?: number;
    thonXomId?: number;
    duongId?: number;
    ngo?: string;
    ngach?: string;
    soNha?: string ;
}

export type LevelType = 'tinhThanh' | 'quanHuyen' | 'phuongXa' | 'thonXom' | 'duongPho' | 'ngo' | 'ngach' | 'soNha';

export interface AddressListType {
    tinhThanh: any;
    quanHuyen?: any;
    phuongXa?: any;
    thonXom?: any;
    duongPho?: any;
    ngo?: any;
    ngach?: any;
}

export interface AddressLevelType {
    id: number;
    tienTo: string;
    ten: string;
}
export interface AddressType {
    tinhThanh: AddressLevelType;
    quanHuyen?: AddressLevelType;
    phuongXa?: AddressLevelType;
    thonXom?: AddressLevelType;
    duongPho?: AddressLevelType;
    ngo?: string;
    ngach?: string;
    soNha?: string;
}
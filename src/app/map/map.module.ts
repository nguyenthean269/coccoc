import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { MainModule } from './main/main.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';


const routes: Routes = [
  {path: '', component: MapComponent}
]

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzDrawerModule,
    NzModalModule,
    MainModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzNotificationModule,
    NzTagModule,
    NzToolTipModule,
    NzSpinModule,
    NzEmptyModule,
    NgSelectModule,
    NzBreadCrumbModule
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }

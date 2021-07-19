import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule
  ],
  exports: [
    MainComponent
  ]
})
export class MainModule { }

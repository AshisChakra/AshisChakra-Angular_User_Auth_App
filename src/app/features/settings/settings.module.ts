import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { SettingsComponent } from './settings.component';
import { AuthGuard } from '../../core/auth/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: SettingsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule { }

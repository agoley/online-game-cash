import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSidenavModule } from '@angular/material';
import { MdCheckboxModule } from '@angular/material';
import { MdSnackBarModule } from '@angular/material';

import { ShopRoutingModule } from './shop-routing.module';
import { FeaturedComponent } from './components/featured/featured.component';
import { SharedModule } from "app/shared/shared.module";
import { GameDetailsComponent } from './components/game-details/game-details.component';

@NgModule({
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule,
    MdCheckboxModule,
    MdSidenavModule,
    MdSnackBarModule
  ],
  declarations: [
    FeaturedComponent,
    GameDetailsComponent,
  ],
  exports: [
    ShopRoutingModule
  ]
})
export class ShopModule { }

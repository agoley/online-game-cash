import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdInputModule } from '@angular/material';
import { MdSidenavModule } from '@angular/material';


import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { ShopModule } from "app/shop/shop.module";
import { UserService } from "app/shared/services/user.service";
import { GameService } from "app/shared/services/game.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    ShopModule,
    MdInputModule,
    MdSidenavModule
  ],
  providers: [UserService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }

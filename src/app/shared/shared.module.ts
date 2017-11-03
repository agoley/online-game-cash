import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';
import { MdIconModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdMenuModule } from '@angular/material';

import { HeaderComponent } from 'app/shared/components/header/header.component';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { SearchBarComponent } from 'app/shared/components/search-bar/search-bar.component';
import { LoginComponent } from './components/login/login.component';
import { SharedRoutingModule } from './shared-routing.module';
import { MdInputModule } from '@angular/material';
import { ReactiveFormsModule } from "@angular/forms";
import { SignupComponent } from './components/signup/signup.component';
import { MenuComponent } from './components/menu/menu.component';
import { SquareHeroComponent } from './components/square-hero/square-hero.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdIconModule,
    MdMenuModule,
    MdInputModule,
    FormsModule,
    SharedRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchBarComponent,
    LoginComponent,
    SignupComponent,
    MenuComponent,
    SquareHeroComponent
  ],
  providers: [],
  exports: [
    HeaderComponent,
    FooterComponent,
    SearchBarComponent,
    SharedRoutingModule,
    MenuComponent,
    SquareHeroComponent
  ]
})
export class SharedModule { }

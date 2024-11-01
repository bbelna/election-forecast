import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './modules/material.module';

const modules = [
  CommonModule,
  RouterOutlet,
  BrowserModule,
  FormsModule,
  MaterialModule,
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class CoreModule { }

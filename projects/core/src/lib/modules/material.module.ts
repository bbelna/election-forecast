import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const modules = [
  MatCheckboxModule,
  MatSelectModule
];

/**
 * Exposes all Angular Material modules used in the application.
 */
@NgModule({
  imports: modules,
  exports: modules,
  providers: [provideAnimationsAsync()]
})
export class MaterialModule { }

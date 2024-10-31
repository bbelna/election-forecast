import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { ElectoralMapComponent } from './components/electoral-map/electoral-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

const materialModules = [
  MatCheckboxModule,
  MatSelectModule
]

@NgModule({
  declarations: [AppComponent, ElectoralMapComponent],
  imports: [
    CommonModule,
    RouterOutlet,
    LeafletModule,
    BrowserModule,
    FormsModule,
    ...materialModules,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

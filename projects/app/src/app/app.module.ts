import { NgModule } from '@angular/core';
import { CoreModule } from 'core';
import { MapModule } from 'map';
import { StateModule } from 'state';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    MapModule,
    StateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

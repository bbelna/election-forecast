import { NgModule } from '@angular/core';
import { CoreModule } from 'core';
import { MapModule } from '../../../map/src/lib/map.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    MapModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

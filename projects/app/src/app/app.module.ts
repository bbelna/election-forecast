import { NgModule } from '@angular/core';
import { CoreModule } from 'core';
import { MapModule } from 'map';
import { StateModule } from 'state';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    MapModule,
    StateModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

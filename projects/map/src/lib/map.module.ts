import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CoreModule } from 'core';
import { MapComponent } from 'map';

const components = [
  MapComponent,
]

@NgModule({
  declarations: components,
  imports: [
    CoreModule,
    LeafletModule,
  ],
  exports: components,
})
export class MapModule {}

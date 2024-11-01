import { NgModule } from '@angular/core';
import { StateComponent } from './state.component';
import { StateGraphComponent } from './components/state-graph/state-graph.component';

const components = [
  StateComponent,
  StateGraphComponent,
];

@NgModule({
  declarations: components,
  exports: components,
})
export class StateModule { }

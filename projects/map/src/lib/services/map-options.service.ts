import { Injectable } from '@angular/core';
import { MapOptions, setProperty } from 'core';


@Injectable({ providedIn: 'root' })
export class MapOptionsService {
  private options: MapOptions = new MapOptions();

  constructor() { }

  get(): MapOptions {
    return this.options;
  }

  setProperty<T = any>(field: string, value: T): void {
    setProperty(this.options, field, value);
  }
}

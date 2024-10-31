import { Injectable } from '@angular/core';
import { ElectoralMapOptions } from '../models/electoral-map-options';
import { setProperty } from '../../lib';

@Injectable({ providedIn: 'root' })
export class ElectoralMapOptionsService {
  private options: ElectoralMapOptions = new ElectoralMapOptions();

  constructor() { }

  get(): ElectoralMapOptions {
    return this.options;
  }

  setProperty<T = any>(field: string, value: T): void {
    setProperty(this.options, field, value);
  }
}
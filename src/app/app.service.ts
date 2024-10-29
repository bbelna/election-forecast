import { Injectable } from '@angular/core';
import { AppConfig } from './models/config/app-config';
import { appConfig } from './config/appConfig';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor() { }

  getConfig(): AppConfig {
    return appConfig;
  }
}
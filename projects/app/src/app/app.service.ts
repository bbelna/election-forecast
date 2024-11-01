import { Injectable } from '@angular/core';
import { MapService } from 'map';
import { BehaviorSubject, Observable } from 'rxjs';
import { StateService } from 'state';

@Injectable({ providedIn: 'root' })
export class AppService {
  initialized$: Observable<boolean>;

  private initialized: BehaviorSubject<boolean>;

  constructor(
    private mapService: MapService,
    private stateService: StateService,
  ) {
    this.initialized = new BehaviorSubject<boolean>(false);
    this.initialized$ = this.initialized.asObservable();
  }

  /**
   * Initializes the application.
   */
  async init(): Promise<void> {
    if (!this.initialized.getValue()) {
      await this.load();
      this.initialized.next(true);
    }
  }

  /**
   * Loads all data required for the application.
   */
  private async load(): Promise<void> {
    await this.mapService.load();
    await this.stateService.load();
  }
}
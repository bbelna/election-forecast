import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  initialized: boolean = false;

  constructor(private appService: AppService) {
    this.appService.initialized$.subscribe((initialized: boolean) => {
      this.initialized = initialized;
    });
  }

  ngOnInit(): void {
    this.appService.init();
  }
}

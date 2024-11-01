import tippy from 'tippy.js';
import * as d3 from 'd3';

import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ElectoralVotes, DateString, Probabilities, Candidates, ConfigService, MapOptions } from 'core';
import { MapOptionsService } from './services/map-options.service';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  electoralVotes: ElectoralVotes;
  selectedDate: DateString;
  availableDates: DateString[] = [];
  mapOptions: MapOptions;
  probabilities: Probabilities;
  candidates: Candidates;

  private svg: any;
  private width: number = 960;
  private height: number = 600;

  constructor(
    protected configService: ConfigService,
    protected mapService: MapService,
    protected mapOptionsService: MapOptionsService,
  ) {
    this.electoralVotes = new ElectoralVotes();
    this.selectedDate = new DateString();
    this.mapOptions = this.mapOptionsService.get();
    this.probabilities = new Probabilities();
    this.candidates = new Candidates();
  }

  ngOnInit() {
    this.mapService.load().then(() => {
      this.availableDates = this.mapService.getAvailableDateStrings();
      this.selectedDate = this.availableDates[0];
      this.candidates = this.configService.getCandidates();
      this.createSvg();
      this.update();
    });
  }

  update(): void {
    this.probabilities = this.mapService.getProbabilities(
      this.selectedDate
    );
    this.updateMap();
  }

  updateMapOptions(field: string, event: MatCheckboxChange): void {
    this.mapOptionsService.setProperty(field, event.checked);

    if (field === 'solidOnly' && event.checked) {
      this.mapOptionsService.setProperty('tilts', false);
      this.mapOptionsService.setProperty('tossups', false);
      this.mapOptions = this.mapOptionsService.get();
    }

    this.update();
  }

  updateMap(): void {
    this.svg.selectAll('path').remove();
    this.drawMap(this.selectedDate);
    this.electoralVotes = this.mapService.getTotalElectoralVotes(
      this.selectedDate
    );
  }

  private createSvg(): void {
    this.svg = d3.select('figure#map')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  private drawMap(date: DateString = new DateString()): void {
    this.svg.attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    const projection = d3.geoAlbersUsa()
      .translate([this.width / 2, this.height / 2])
      .scale(1000);
    const pathGenerator = d3.geoPath().projection(projection);
    const geoData = this.mapService.getGeoData();

    this.svg.selectAll('path')
      .data(geoData)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', (d: any) => {
        const stateName = d.properties.name;
        return this.mapService.getColor(stateName, date);
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .each((d: any, i: number, nodes: SVGGElement[]) => {
        const element = nodes[i];
        tippy(element, {
          content: this.mapService.getTooltip(
            d.properties.name,
            date
          ),
          placement: 'top',
          trigger: 'mouseenter',
          allowHTML: true,
          duration: 0,
          onShow(instance) {
            instance.popper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            instance.popper.style.border = '1px solid #ccc';
            instance.popper.style.borderRadius = '5px';
            instance.popper.style.padding = '5px';
          },
        });
    });
  }
}

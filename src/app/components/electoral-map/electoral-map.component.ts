import tippy from 'tippy.js';
import * as d3 from 'd3';

import { Component, OnInit } from '@angular/core';
import { ElectoralMapService } from '../../services/electoral-map.service';
import { ElectoralVotes } from '../../models/electoral-votes';
import { DateString } from '../../types/date-string';
import { ElectoralMapOptions } from '../../models/electoral-map-options';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ElectoralMapOptionsService } from '../../services/electoral-map-options.service';
import { Probabilities } from '../../types/probabilities';
import { Candidates } from '../../models/config/candidates';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-electoral-map',
  templateUrl: './electoral-map.component.html',
  styleUrls: ['./electoral-map.component.scss']
})
export class ElectoralMapComponent implements OnInit {
  electoralVotes: ElectoralVotes;
  selectedDate: DateString;
  availableDates: DateString[] = [];
  mapOptions: ElectoralMapOptions;
  probabilities: Probabilities;
  candidates: Candidates;

  private svg: any;
  private width: number = 960;
  private height: number = 600;

  constructor(
    protected configService: ConfigService,
    protected electoralMapService: ElectoralMapService,
    protected electoralMapOptionsService: ElectoralMapOptionsService,
  ) {
    this.electoralVotes = new ElectoralVotes();
    this.selectedDate = new DateString();
    this.mapOptions = this.electoralMapOptionsService.get();
    this.probabilities = new Probabilities();
    this.candidates = new Candidates();
  }

  ngOnInit() {
    this.electoralMapService.load().then(() => {
      this.availableDates = this.electoralMapService.getAvailableDateStrings();
      this.selectedDate = this.availableDates[0];
      this.candidates = this.configService.getCandidates();
      this.createSvg();
      this.update();
    });
  }

  update(): void {
    this.probabilities = this.electoralMapService.getProbabilities(
      this.selectedDate
    );
    this.updateMap();
  }

  updateMapOptions(field: string, event: MatCheckboxChange): void {
    this.electoralMapOptionsService.setProperty(field, event.checked);

    if (field === 'solidOnly' && event.checked) {
      this.electoralMapOptionsService.setProperty('tilts', false);
      this.electoralMapOptionsService.setProperty('tossups', false);
      this.mapOptions = this.electoralMapOptionsService.get();
    }

    this.update();
  }

  updateMap(): void {
    this.svg.selectAll('path').remove();
    this.drawMap(this.selectedDate);
    this.electoralVotes = this.electoralMapService.getTotalElectoralVotes(
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
    const geoData = this.electoralMapService.getGeoData();

    this.svg.selectAll('path')
      .data(geoData)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', (d: any) => {
        const stateName = d.properties.name;
        return this.electoralMapService.getColor(stateName, date);
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .each((d: any, i: number, nodes: SVGGElement[]) => {
        const element = nodes[i];
        tippy(element, {
          content: this.electoralMapService.getTooltip(
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

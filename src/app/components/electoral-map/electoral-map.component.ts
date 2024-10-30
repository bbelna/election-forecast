import tippy from 'tippy.js';
import * as d3 from 'd3';

import { Component, OnInit } from '@angular/core';
import { ElectoralMapService } from '../../services/electoral-map.service';
import { ElectoralVotes } from '../../models/electoral-votes';

@Component({
  selector: 'app-electoral-map',
  templateUrl: './electoral-map.component.html',
  styleUrls: ['./electoral-map.component.scss']
})
export class ElectoralMapComponent implements OnInit {
  electoralVotes: ElectoralVotes = new ElectoralVotes(0, 0);

  private svg: any;
  private width: number = 960;
  private height: number = 600;

  constructor(
    protected electoralMapService: ElectoralMapService,
  ) { }

  ngOnInit() {
    this.electoralMapService.load().then(() => {
      this.createSvg();
      this.drawMap();
      this.electoralVotes = this.electoralMapService.getTotalElectoralVotes();
    });
  }

  private createSvg(): void {
    this.svg = d3.select('figure#map')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  private drawMap(date: Date = new Date()): void {
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
      .attr('fill', (d: any) => this.electoralMapService.getColor(d.properties.name))
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .each((d: any, i: number, nodes: SVGGElement[]) => {
        const element = nodes[i];
        tippy(element, {
          content: this.electoralMapService.getTooltip(d.properties.name, date),
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

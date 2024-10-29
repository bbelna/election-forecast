import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { stateProbabilities } from './state-probabilities';
import { states } from './states';
import tippy from 'tippy.js';

@Component({
  selector: 'app-electoral-map',
  templateUrl: './electoral-map.component.html',
  styleUrls: ['./electoral-map.component.scss']
})
export class ElectoralMapComponent implements OnInit {
  private svg: any;
  private width: number = 960;
  private height: number = 600;
  private dCandidate = 'Harris-Waltz';
  private rCandidate = 'Trump-Vance';

  ngOnInit() {
    this.createSvg();
    this.drawMap();
  }

  private createSvg(): void {
    this.svg = d3.select("figure#map")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  private drawMap(): void {
    const width = 800; // Adjust as needed
    const height = 500;

    this.svg.attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

    const projection = d3.geoAlbersUsa()
      .translate([width / 2, height / 2]) // Center the map
      .scale(1000); // Adjust scale to fit the SVG

    const pathGenerator = d3.geoPath().projection(projection);

    const promises = states.map(state => d3.json(`assets/geojson/${state}`));

    Promise.all(promises).then((data) => {
      const allFeatures = data.flatMap((stateData: any) => {
        return stateData.type === "FeatureCollection" ? stateData.features : [stateData];
      });

      // Bind to the combined features
      this.svg.selectAll('path')
        .data(allFeatures) // Bind the complete feature array
        .enter()
        .append('path')
        .attr('d', pathGenerator) // Generate paths
        .attr('fill', (d: any) => this.getColor(d.properties.name)) // Apply color logic based on state name
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .each((d: any, i: number, nodes: SVGGElement[]) => {
          const element = nodes[i];
          tippy(element, {
            content: this.getContent(d.properties.name),
            placement: 'top',
            trigger: 'mouseenter',
            allowHTML: true,
            duration: 0, // Ensures tooltip disappears immediately on mouse leave
            onShow(instance) {
              instance.popper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              instance.popper.style.border = '1px solid #ccc';
              instance.popper.style.borderRadius = '5px';
              instance.popper.style.padding = '5px';
            },
          });
      });
    }).catch(error => console.error("Error loading state data:", error));
  }

  private getProbability(stateName: string): number {
    return stateProbabilities[stateName] ?? 0;
  }

  private getContent(stateName: string): string {
    const dProb = this.getProbability(stateName);
    const rProb = 100 - dProb;
    let desc = 'Tossup';
    if (dProb > rProb) desc = `${this.dCandidate} tilt`;
    else if (rProb > dProb) desc = `${this.rCandidate} tilt`;
    return `<strong>${stateName}</strong><br/>`
      + `<i>${this.getStateRating(dProb, rProb)}</i><br/>`
      + `${this.dCandidate}: ${dProb}%<br/>`
      + `${this.rCandidate}: ${rProb}%`;
  }

  private getStateRating(dProbability: number, rProbability: number): string {
    const margin = dProbability - rProbability;

    if (margin >= 50) {
      return "Solid D"; // Solid Democrat
    } else if (margin >= 35) {
      return "Likely D"; // Likely Democrat
    } else if (margin >= 20) {
      return "Lean D"; // Lean Democrat
    } else if (margin >= 10) {
      return "Tilt D"; // Tilt Democrat
    } else if (margin <= -50) {
      return "Solid R"; // Solid Republican
    } else if (margin <= -35) {
      return "Likely R"; // Likely Republican
    } else if (margin <= -20) {
      return "Lean R"; // Lean Republican
    } else if (margin <= -10) {
      return "Tilt R"; // Tilt Republican
    } else {
      return "Toss-Up"; // Very close
    }
  }

  private getColor(stateName: string): string {
    const dProb = this.getProbability(stateName);
    const rProb = 100 - dProb;
    const classification = this.getStateRating(dProb, rProb);

    switch (classification) {
      case "Solid D":
        return "#0033ff"; // Blue
      case "Likely D":
        return "#5274fa"; // Light blue
      case "Lean D":
        return "#9cafff"; // Very light 
      case "Tilt D":
        return "#d2dafc"; // Very very light blue
      case "Solid R":
        return "#f5020f"; // Red
      case "Likely R":
        return "#fc7980"; // Light red
      case "Lean R":
        return "#fcaeb2"; // Very light red
      case "Tilt R":
        return "#ffe3e8"; // Very very light red
      default:
        return "#ffd857"; // Gray
    }
  }
}

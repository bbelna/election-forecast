import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-electoral-map',
  templateUrl: './electoral-map.component.html',
  styleUrls: ['./electoral-map.component.scss']
})
export class ElectoralMapComponent {
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 4,
    center: L.latLng(37.8, -96)
  };

  // Probabilities by state name or ID
  stateProbabilities: { [key: string]: number } = {
    'Alabama': 40,
    'Alaska': 45,
    'Arizona': 49,
    'Arkansas': 35,
    'California': 70,
    'Colorado': 60,
    'Connecticut': 65,
    'Delaware': 60,
    'Florida': 45,
    'Georgia': 60,
    'North Carolina': 54,
    'Nevada': 49,
    'Pennsylvania': 60,
    'Wisconsin': 58,
    'Michigan': 57,
    // Add probabilities for remaining states
  };

  onMapReady(map: L.Map) {
    // Load the GeoJSON data
    fetch('assets/states.geo.json')
      .then(response => response.json())
      .then(data => {
        const statesLayer = L.geoJSON(data, {
          style: (feature) => this.getStyleForState(feature),
          onEachFeature: (feature, layer) => {
            const stateName = feature.properties.name;
            const probability = this.stateProbabilities[stateName];
            layer.bindPopup(`<strong>${stateName}</strong><br>Probability: ${probability}% chance`);
          }
        });
        statesLayer.addTo(map);
      });
  }

  getStyleForState(feature: any) {
    const stateName = feature.properties.name;
    const probability = this.stateProbabilities[stateName];
    return {
      fillColor: this.getColor(probability),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  getColor(probability: number): string {
    // Example color scheme based on probability ranges
    if (probability >= 60) return '#003f5c';  // Darker blue for high Democratic probability
    if (probability >= 50) return '#2f4b7c';  // Lighter blue for leaning Democratic
    if (probability < 50 && probability >= 40) return '#ff7c43';  // Lighter red for leaning Republican
    return '#d45087';  // Darker red for high Republican probability
  }
}

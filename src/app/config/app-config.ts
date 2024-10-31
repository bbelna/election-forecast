import { AppConfig } from '../models/config/app-config';

export const appConfig: AppConfig = {
  solidOnly: false,
  tilts: true,
  tossups: true,
  ratingMargins: {
    solid: 65,
    likely: 40,
    lean: 20,
    tilt: 10
  },
  candidates: {
    democrat: 'Harris/Waltz',
    republican: 'Trump/Vance'
  },
  evConfig: {
    baseEvDem: 216,
    baseEvRep: 149,
    evStates: {
      'Nevada': 6,
      'Arizona': 11,
      'Georgia': 16,
      'Florida': 30,
      'North Carolina': 16,
      'Pennsylvania': 19,
      'Michigan': 15,
      'Wisconsin': 10,
      'Texas': 40,
      'Minnesota': 10,
    }
  },
  mapColors: {
    solidD: '#0033ff',
    likelyD: '#5274fa',
    leanD: '#9cafff',
    tiltD: '#d2dafc',
    solidR: '#f5020f',
    likelyR: '#ff666e',
    leanR: '#fcaeb2',
    tiltR: '#ffcfd7',
    tossup: '#ffc403',
  }
};
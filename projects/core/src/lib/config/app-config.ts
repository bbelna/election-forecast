import { AppConfig } from '../models/config/app-config';

export const appConfig: AppConfig = {
  ratingMargins: {
    solid: 60,
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
    solidD: '#0240f7',
    likelyD: '#6679ff',
    leanD: '#99a8ff',
    tiltD: '#cdd8ff',
    solidR: '#f50202',
    likelyR: '#ff808a',
    leanR: '#f8a3a7',
    tiltR: '#fcd2d4',
    tossup: '#FFC300',
  }
};
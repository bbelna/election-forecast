export const appConfig = {
  tilts: true,
  ratingMargins: {
    solid: 70,
    likely: 40,
    lean: 30,
    tilt: 20
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
  }
};
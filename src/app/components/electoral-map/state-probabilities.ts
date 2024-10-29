export const stateProbabilities: { [key: string]: number } = {
  // Solid Democratic States
  "California": 100,
  "New York": 100,
  "Illinois": 95,
  "Massachusetts": 100,
  "Maryland": 100,
  "Maine": 95,
  "Vermont": 100,
  "Connecticut": 100,
  "Rhode Island": 100,
  "Virginia": 85,
  "Washington": 100,
  "Oregon": 100,
  "New Jersey": 95,
  "Delaware": 100,
  "Hawaii": 100,

  // Lean Democratic States
  "Colorado": 80,
  "New Mexico": 70,
  "Minnesota": 70,
  "Pennsylvania": 60,
  "Wisconsin": 58,
  "Michigan": 57,
  
  // Tilt Democratic States
  "Georgia": 60,
  "North Carolina": 54,

  // Tilt Republican States (values below 50% represent a Republican lean)
  "Nevada": 49,
  "Arizona": 49,

  // Lean Republican States
  "Texas": 30,  // 70% R win likelihood
  "Florida": 30,  // 70% R win likelihood
  "Ohio": 26,  // 65% R win likelihood
  
  // Solid Republican States
  "Alabama": 5,
  "Oklahoma": 5,
  "Wyoming": 5,
  "Idaho": 5,
  // Add other solid Republican states as necessary

  // Toss-Up States (true 50-50)
  "New Hampshire": 95,
  "Maine 2nd District": 50
};
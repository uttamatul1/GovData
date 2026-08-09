export interface IndiaState {
  code: string;            // "IN-MH"
  name: string;
  capital: string;
  region: 'north' | 'south' | 'east' | 'west' | 'central' | 'northeast' | 'ut';
  area: number;            // sq km
  pathD: string;           // SVG path data for the D3 map
  centroidLat: number;
  centroidLng: number;
}

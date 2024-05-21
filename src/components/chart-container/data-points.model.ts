export interface ChartDataPoints {
  name: string;
  type: string;
  showInLegend: boolean;
  xValueFormatString: string;
  dataPoints: ChartChoicesCoordinates[];
}

export interface ChartChoices {
  [key: string]: ChartChoicesCoordinates[];
}

export interface ChartChoicesCoordinates {
  x: Date;
  y: number;
}

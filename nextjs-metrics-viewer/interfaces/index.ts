export enum Headers {
  Date = "Date",
  Category = "Category",
  Value = "Value",
}

export interface formattedSeries {
  name: string;
  data: { x: string; y: string }[];
}

export interface Options {
  chart: Chart;
  tooltip: Tooltip;
  dataLabels: DataLabels;
  stroke: Stroke;
  grid: Grid;
  series: Series[];
  legend: Legend;
  yaxis: Yaxi[];
  annotations: Annotations;
  xaxis: Xaxis;
}

export interface Annotations {
  yaxis: any[];
  xaxis: any[];
  points: any[];
}

export interface Chart {
  height: string;
  maxWidth: string;
  type: string;
  fontFamily: string;
  dropShadow: DataLabels;
  toolbar: Legend;
}

export interface DataLabels {
  enabled: boolean;
}

export interface Legend {
  show: boolean;
}

export interface Grid {
  show: boolean;
  strokeDashArray: number;
  padding: Padding;
}

export interface Padding {
  left: number;
  right: number;
  top: number;
}

export interface Series {
  name: string;
  data: Datum[];
}

export interface Datum {
  x: string;
  y: number;
}

export interface Stroke {
  curve: string;
  width: number;
}

export interface Tooltip {
  enabled: boolean;
  x: Legend;
}

export interface Xaxis {
  convertedCatToNumeric: boolean;
}

export interface Yaxi {
  show: boolean;
  showAlways: boolean;
  showForNullSeries: boolean;
  opposite: boolean;
  reversed: boolean;
  logarithmic: boolean;
  logBase: number;
  forceNiceScale: boolean;
  floating: boolean;
  labels: Labels;
  axisBorder: Axis;
  axisTicks: Axis;
  title: Title;
  tooltip: YaxiTooltip;
  crosshairs: Crosshairs;
}

export interface Axis {
  show: boolean;
  color: string;
  width: number;
  offsetX: number;
  offsetY: number;
}

export interface Crosshairs {
  show: boolean;
  position: string;
  stroke: CrosshairsStroke;
}

export interface CrosshairsStroke {
  color: string;
  width: number;
  dashArray: number;
}

export interface Labels {
  show: boolean;
  showDuplicates: boolean;
  minWidth: number;
  maxWidth: number;
  offsetX: number;
  offsetY: number;
  rotate: number;
  padding: number;
  style: Style;
}

export interface Style {
  colors?: null[];
  fontSize: string;
  fontWeight: number;
  cssClass: string;
}

export interface Title {
  rotate: number;
  offsetY: number;
  offsetX: number;
  style: Style;
}

export interface YaxiTooltip {
  enabled: boolean;
  offsetX: number;
}

export interface Metrics {
  max: number;
  min: number;
  total: number;
  average: number;
}

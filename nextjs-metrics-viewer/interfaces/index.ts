export interface formattedSeries {
  name: string;
  data: { x: string; y: string }[];
}

export enum Headers {
  Date = "Date",
  Category = "Category",
  Value = "Value",
}

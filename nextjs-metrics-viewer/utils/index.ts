import { Headers, formattedSeries } from "@/interfaces";

export function ProccessData(data: string) {
  const text = data.split("\r\n");
  const headers = text.shift()?.split(",");
  const splittedData = text.map((row) => {
    let obj: { [key in Headers]?: string } = {};
    const values = row.split(",");
    headers?.forEach((header, index) => {
      obj[header as Headers] = values[index];
    });
    return obj;
  });

  const allDates = Array.from(
    new Set(splittedData.map((row) => row[Headers.Date])),
  );

  const allCategories = Array.from(
    new Set(splittedData.map((row) => row[Headers.Category])),
  );

  const normalizedData = allDates.flatMap((date) => {
    return allCategories.map((category) => {
      let obj: { [key in Headers]?: string } = {};
      const entry = splittedData.find(
        (item) =>
          item[Headers.Date] === date && item[Headers.Category] === category,
      );
      obj[Headers.Date] = date;
      obj[Headers.Category] = category;
      obj[Headers.Value] = entry?.[Headers.Value] ?? "0";
      return obj;
    });
  });

  const mapData = new Map<string, formattedSeries>();

  normalizedData.forEach((row) => {
    const category = row[Headers.Category];
    if (!category) return;
    if (!mapData.has(category)) {
      mapData.set(category, {
        name: category,
        data: [],
      });
    }
    if (!row[Headers.Date] || !row[Headers.Value]) return;
    mapData
      .get(category)
      ?.data.push({ x: row[Headers.Date], y: row[Headers.Value] });
  });

  const dataSeries = Array.from(mapData.values()) as [];

  return dataSeries;
}

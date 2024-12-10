import { AnalyticsModel } from "./model";

export const AnalyticsUtilities = {
  calculateMetrics(data: AnalyticsModel[]) {
    const elements = data.map((element) => element.props);
    const total = elements.reduce((sum, item) => sum + item.value, 0);
    const average = total / data.length;
    const max = Math.max(...elements.map((item) => item.value));
    const min = Math.min(...elements.map((item) => item.value));

    return { total, average, max, min };
  },
};

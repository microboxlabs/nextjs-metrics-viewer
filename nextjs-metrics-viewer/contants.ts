export const INITIAL_OPTIONS = {
  colors: ["#77dd77", "#fdfd96", "#84b6f4", "#fdcae1"],
  chart: {
    height: "100%",
    maxWidth: "100%",
    type: "line",
    fontFamily: "Inter, sans-serif",
    dropShadow: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    enabled: true,
    x: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 6,
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: -26,
    },
  },
  series: [],
  legend: {
    show: false,
  },
};

export const INITIAL_METRICS = {
  max: 0,
  min: 0,
  total: 0,
  average: 0,
};

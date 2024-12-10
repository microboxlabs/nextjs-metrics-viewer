"use client";
import { AnalyticsModelProps } from "@/domain/analytics/model";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

function TimeSeriesChart({ analytics }: { analytics: AnalyticsModelProps[] }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 600;
    const height = 300;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const x = d3
      .scaleTime()
      .domain(d3.extent(analytics, (d) => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(analytics, (d) => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0),
      );

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("path")
      .datum(analytics)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }, [analytics]);

  return <svg ref={ref} width={600} height={300} />;
}

export { TimeSeriesChart };

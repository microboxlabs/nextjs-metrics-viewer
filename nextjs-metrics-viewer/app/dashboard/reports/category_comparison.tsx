"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { AnalyticsModelProps } from "@/domain/analytics/model";

function BarChart({ analytics }: { analytics: AnalyticsModelProps[] }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 600;
    const height = 300;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const x = d3
      .scaleBand()
      .domain(analytics.map((d) => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(analytics, (d) => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(analytics)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.category) ?? 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", "steelblue");
  }, [analytics]);

  return <svg ref={ref} width={600} height={300} />;
}

export { BarChart };

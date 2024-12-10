"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

function BarChart({
  analytics,
}: {
  analytics: { category: string; value: number }[];
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 400;
    const height = 300;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    svg.selectAll("*").remove();

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
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(analytics)
      .join("rect")
      .attr("x", (d) => x(d.category)!)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value))
      .attr("width", x.bandwidth());

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [analytics]);

  return <svg ref={ref} width={400} height={300} />;
}

export { BarChart };

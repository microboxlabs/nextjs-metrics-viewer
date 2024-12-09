import { Options, Series } from "@/interfaces";
import { Button, ButtonGroup } from "flowbite-react";
import { useEffect, useState } from "react";

export default function ToggleFilters({
  data,
  toggleSeries,
  updateMetrics,
}: {
  data: Options;
  toggleSeries: (name: string) => void;
  updateMetrics: (arr: Series[]) => void;
}) {
  const [toggles, setToggles] = useState(() => data?.series?.map(() => true));

  const toggleButton = (index: number) => {
    setToggles((prev) =>
      prev.map((isVisible, i) => {
        return i === index ? !isVisible : isVisible;
      }),
    );

    toggleSeries(data.series[index].name);
  };

  useEffect(() => {
    setToggles(data?.series?.map(() => true));
  }, [data.series]);

  useEffect(() => {
    const visibleSeries = data.series.filter((_, index) => toggles[index]);
    updateMetrics(visibleSeries);
  }, [toggles]);

  return (
    <div className="mt-4 flex justify-center border-t border-gray-700 pt-4">
      <ButtonGroup>
        {data.series.map((category, index) => (
          <Button
            key={index}
            onClick={() => toggleButton(index)}
            className="bg-gray-800 focus:ring-0"
            style={{
              color: data.colors[index],
              opacity: toggles[index] ? 1 : 0.5,
            }}
          >
            {category.name}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}

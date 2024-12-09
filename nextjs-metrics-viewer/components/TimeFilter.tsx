import { Options, Series } from "@/interfaces";
import { Datepicker } from "flowbite-react";
import { useEffect, useState } from "react";

export default function TimeFilter({
  data,
  updateMetrics,
  updateSeries,
}: {
  data: Options;
  updateMetrics: (arr: Series[]) => void;
  updateSeries: (series: Series[]) => void;
}) {
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  const firstDateHandler = (date: Date) => {
    setMinDate(date);
  };

  const secondDateHandler = (date: Date) => {
    setMaxDate(date);
  };

  useEffect(() => {
    const visibleDates = data.series.map((category) => {
      return {
        name: category.name,
        data: category.data.filter(
          (item) =>
            new Date(item.x + "T03:00:00Z") >= minDate &&
            new Date(item.x + "T03:00:00Z") <= maxDate,
        ),
      };
    });

    updateMetrics(visibleDates);
    updateSeries(visibleDates);
  }, [minDate, maxDate]);

  return (
    <div className="flex gap-4">
      <Datepicker
        onSelectedDateChanged={firstDateHandler}
        className="mb-2"
        weekStart={1}
        maxDate={new Date()}
      />
      <Datepicker
        onSelectedDateChanged={secondDateHandler}
        weekStart={1}
        minDate={minDate}
        maxDate={new Date()}
      />
    </div>
  );
}

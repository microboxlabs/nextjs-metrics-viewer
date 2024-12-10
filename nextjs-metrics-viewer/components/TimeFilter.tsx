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
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  const firstDateHandler = (date: Date) => {
    setFirstDate(date);
    setMinDate(date);
  };

  const secondDateHandler = (date: Date) => {
    setSecondDate(date);
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
        className="mb-2 [&_input]:border-gray-600 [&_input]:bg-gray-800 [&_input]:text-white"
        onSelectedDateChanged={firstDateHandler}
        weekStart={1}
        maxDate={new Date()}
        value={firstDate.toLocaleDateString()}
      />
      <Datepicker
        className="mb-2 [&_input]:border-gray-600 [&_input]:bg-gray-800 [&_input]:text-white"
        onSelectedDateChanged={secondDateHandler}
        weekStart={1}
        minDate={minDate}
        maxDate={new Date()}
        value={secondDate.toLocaleDateString()}
      />
    </div>
  );
}

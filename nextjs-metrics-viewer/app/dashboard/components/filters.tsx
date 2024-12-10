"use client";
import { Button, Datepicker, Dropdown } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type DashboardFiltersProps = {
  categories?: string[];
};

function DashboardFilters({ categories }: DashboardFiltersProps) {
  const router = useRouter();

  const [filters, setFilters] = useState<{
    initDate?: string;
    endDate?: string;
    category?: string;
  }>({});

  function handleDateChange(name: "initDate" | "endDate", value: Date) {
    setFilters({
      ...filters,
      [name]: value.toISOString().split("T")[0],
    });
  }

  function handleFilter(e: React.MouseEvent) {
    e.preventDefault();
    const url = `/dashboard?${new URLSearchParams(filters).toString()}#${Date.now()}`;
    router.push(url);
  }

  return (
    <div className="flex-start flex w-full flex-col gap-2 md:flex-row md:items-end">
      <div>
        <label className="text-sm text-gray-500">Fecha de inicio</label>
        <Datepicker
          title="Fecha de inicio"
          name="initDate"
          onSelectedDateChanged={(value) => handleDateChange("initDate", value)}
        />
      </div>
      <div>
        <label className="text-sm text-gray-500">Fecha fin</label>
        <Datepicker
          title="Fecha fin"
          name="endDate"
          onSelectedDateChanged={(value) => handleDateChange("endDate", value)}
        />
      </div>
      <Dropdown label={filters.category || "Categorias"} outline color="dark">
        {categories?.map((category) => (
          <Dropdown.Item
            key={category}
            onClick={() => setFilters({ ...filters, category })}
          >
            {category}
          </Dropdown.Item>
        )) || []}
      </Dropdown>
      <Button
        onClick={handleFilter}
        disabled={Object.keys(filters).length === 0}
      >
        Filtrar datos
      </Button>
    </div>
  );
}

export { DashboardFilters };

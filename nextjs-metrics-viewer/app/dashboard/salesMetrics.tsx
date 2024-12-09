'use client'

import CSS from "csstype";
import { useAppSelector } from "../store/hooks";
import { selectTotalSales, selectAvgSales, selectMinSale, selectMaxSale } from "../store/slices/productsSlice"

export default function SalesMetrics() {

  const divStyle: CSS.Properties = {
    marginTop: "40px",
    paddingBottom: "0rem"
  }

  const dataStyle: CSS.Properties = {
    marginTop: "0px"
  }

  const infoStyle: CSS.Properties = {
    paddingTop: "0rem"
  }

  const totalSales = useAppSelector(selectTotalSales)
  const averageSales = useAppSelector(selectAvgSales)
  const minSale = useAppSelector(selectMinSale)
  const maxSale = useAppSelector(selectMaxSale)
  
  return (
    <>
      <div
        className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8" style={divStyle}>
        <h3 className="text-3xl font-bold dark:text-white">Sales</h3>

        </div>
      <div
        className="bg-white rounded-lg md:p-8 dark:bg-gray-800" style={infoStyle}>
        <dl className="grid max-w-screen-xl grid-cols-2 gap-8 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8" style={dataStyle}>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-2xl font-extrabold">${totalSales}</dt>
            <dd className="text-gray-500 dark:text-gray-400">Total Sales</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-2xl font-extrabold">${averageSales.toFixed(1)}</dt>
            <dd className="text-gray-500 dark:text-gray-400">Average Sales</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-2xl font-extrabold">${maxSale}</dt>
            <dd className="text-gray-500 dark:text-gray-400">Maximum Sale</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-2xl font-extrabold">${minSale}</dt>
            <dd className="text-gray-500 dark:text-gray-400">Minimum Sale</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
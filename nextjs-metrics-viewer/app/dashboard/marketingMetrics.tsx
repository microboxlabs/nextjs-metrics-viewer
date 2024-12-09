'use client'

import CSS from "csstype";
import { useAppSelector } from "../store/hooks";
import { selectTotalMarketing, selectAvgMarketing, selectMinMarketing, selectMaxMarketing } from "../store/slices/productsSlice"

export default function MarketingMetrics() {

  const divStyle: CSS.Properties = {
    paddingBottom: "0rem"
  }

  const dataStyle: CSS.Properties = {
    marginTop: "0px"
  }

  const infoStyle: CSS.Properties = {
    paddingTop: "0rem"
  }

  const totalMarketing = useAppSelector(selectTotalMarketing)
  const averageMarketing = useAppSelector(selectAvgMarketing)
  const minMarketing = useAppSelector(selectMinMarketing)
  const maxMarketing = useAppSelector(selectMaxMarketing)
  
  return (
    <>
      <div
        className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8" style={divStyle}>
        <h3 className="text-3xl font-bold dark:text-white">Expenses</h3>

        </div>
      <div
        className="bg-white rounded-lg md:p-8 dark:bg-gray-800" style={infoStyle}>
        <dl className="grid max-w-screen-xl grid-cols-2 gap-8 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8" style={dataStyle}>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-2xl font-extrabold">${totalMarketing}</dt>
            <dd className="text-gray-500 dark:text-gray-400">Total Expenses</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-2xl font-extrabold">${averageMarketing.toFixed(1)}</dt>
            <dd className="text-gray-500 dark:text-gray-400">Average Expenses</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-2xl font-extrabold">${minMarketing}</dt>
            <dd className="text-gray-500 dark:text-gray-400">Maximum Expenses</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-2xl font-extrabold">${maxMarketing}</dt>
            <dd className="text-gray-500 dark:text-gray-400">Minimum Expenses</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
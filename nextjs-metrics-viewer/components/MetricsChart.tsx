export default function MetricsChart() {
  return (
    <div className="w-full rounded-lg  bg-gray-800 p-4 shadow md:p-6">
      <div className="mb-4 flex justify-between border-b  border-gray-700 pb-4">
        <div className="flex items-center">
          <div className="me-3 flex size-12 items-center justify-center rounded-lg bg-gray-700">
            <svg
              className="size-6 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 19"
            >
              <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z" />
              <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
            </svg>
          </div>
          <div>
            <h5 className="pb-1 text-2xl font-bold leading-none text-white">
              3.4k
            </h5>
            <p className="text-sm font-normal text-gray-400">
              Leads generated per week
            </p>
          </div>
        </div>
        <div>
          <span className="inline-flex items-center rounded-md  bg-green-900 px-2.5 py-1 text-xs font-medium text-green-300">
            <svg
              className="me-1.5 size-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13V1m0 0L1 5m4-4 4 4"
              />
            </svg>
            42.5%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <dl className="flex items-center">
          <dt className="me-1 text-sm font-normal text-gray-400">
            Money spent:
          </dt>
          <dd className="text-sm font-semibold text-white">$3,232</dd>
        </dl>
        <dl className="flex items-center justify-end">
          <dt className="me-1 text-sm font-normal text-gray-400">
            Conversion rate:
          </dt>
          <dd className="text-sm font-semibold text-white">1.2%</dd>
        </dl>
      </div>

      <div id="column-chart" className="w-full">
        <span className="text-white">NO DATA</span>
      </div>
      <div className="grid grid-cols-1 items-center justify-between border-t border-gray-700">
        <div className="flex items-center justify-between pt-5">
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="lastDaysdropdown"
            data-dropdown-placement="bottom"
            className="inline-flex items-center text-center text-sm font-medium text-gray-400 hover:text-white"
            type="button"
          >
            Last 7 days
            <svg
              className="m-2.5 ms-1.5 w-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="lastDaysdropdown"
            className="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg  bg-gray-700 shadow"
          >
            <ul
              className="py-2 text-sm text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
                >
                  Yesterday
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
                >
                  Today
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
                >
                  Last 7 days
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
                >
                  Last 30 days
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
                >
                  Last 90 days
                </a>
              </li>
            </ul>
          </div>
          <a
            href="#"
            className="inline-flex items-center rounded-lg border-gray-700 px-3 py-2 text-sm font-semibold uppercase text-blue-600 hover:bg-gray-700 hover:text-blue-500 focus:ring-gray-700"
          >
            Leads Report
            <svg
              className="ms-1.5 size-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

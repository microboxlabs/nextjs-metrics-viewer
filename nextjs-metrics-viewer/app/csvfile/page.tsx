'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import CSS from "csstype";


interface CSVRow {
  [key: string]: string | number | boolean | null;
}

export default function CSVFileAdd() {

  const [fileData, setFileData] = useState<CSVRow[]>([]);
  const [showModalCreation, setShowModalCreation] = useState(false);
  const [showModalError, setShowModalError] = useState(false);


  const onFileHandler = (event: any) => {
    const csvFile = event.target.files[0];

    Papa.parse(csvFile, {
      skipEmptyLines: true,
      complete: function(results) {
        setFileData(results.data as CSVRow[])
      }
    });

  }

  const onSaveFileData = async () => {
    fileData.shift();
    try {
      const response = await fetch('/products', {
        method: 'POST',
        body: JSON.stringify(fileData)
      })
      if (response.status == 201) {
        setFileData([]);
        setShowModalCreation(true);
        return
      }
      setShowModalError(true);
    } catch (error) {
      console.log('Ha ocurrido un error');
      alert('Error al guardar los datos');
    }
  }

  const modalStyle: CSS.Properties = {
    position: 'absolute',
    top: "40%",
    left: "35%",
  }

  return (
    <>
      <label className="block mb-2 mt-20 text-sm font-medium text-gray-900 dark:text-white">Selecciona el archivo CSV</label>
      <input 
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={onFileHandler}
        accept='.csv'
      />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">CSV File</p>
      <button 
        type="button"
        className="text-white mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={onSaveFileData}
      >
        Guardar Data
      </button>
      
      { showModalCreation ? 
        <div 
          id="popup-modal"
          tabIndex={-1} 
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          role="dialog" 
          aria-modal="true"
          style={modalStyle}
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="p-4 md:p-5 text-center">
                <svg 
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Se han guardado los datos correctamente
                </h3>
                <button 
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => setShowModalCreation(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div> : null
      }
      { showModalError ? 
        <div 
          id="popup-modal"
          tabIndex={-1} 
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          role="dialog" 
          aria-modal="true"
          style={modalStyle}
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="p-4 md:p-5 text-center">
                <svg 
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Debe ingresar un archivo .CSV para agregar data
                </h3>
                <button 
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => setShowModalError(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div> : null
      }
    </>
  );
  }
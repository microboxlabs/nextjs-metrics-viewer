import Papa from "papaparse";
/**
 * A function that reads the file and converts the data into an Object.
 * @param file  - CSV File Object
 * @returns a data Object or an error Object
 */
export const ReadCSV = (file: File): Promise<Array<Record<string, string>>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, 
      skipEmptyLines: true, 
      complete: (result: any) => {
        resolve(result.data); 
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};

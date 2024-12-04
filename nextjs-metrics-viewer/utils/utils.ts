import Papa from "papaparse";

export const ReadCSV = (file: File): Promise<Array<Record<string, string>>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, // Usa la primera fila como encabezados
      skipEmptyLines: true, // Omite líneas vacías
      complete: (result: any) => {
        resolve(result.data); // `data` contiene el array de objetos
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};

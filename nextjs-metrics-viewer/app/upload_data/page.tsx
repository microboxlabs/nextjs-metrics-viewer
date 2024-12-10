"use client";
import { Button, FileInput, Label, Toast } from "flowbite-react";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { HiCheck, HiX } from "react-icons/hi";

function UploadDataPage() {
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [fileLoaded, setFileLoaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileLoaded(false);

    if (!event.target.files || event.target.files.length === 0) return;

    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (!selectedFile.name.endsWith(".csv")) {
        setError("El archivo seleccionado no es un archivo CSV");
        return;
      }
      setFile(selectedFile);
    }

    setFileLoaded(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      setLoading(true);

      if (setShowToast) setShowToast(null);

      const formData = new FormData();
      formData.append("file", file as File);

      const response = await fetch("/api/analytics", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setShowToast({
          message: "Archivo procesado correctamente.",
          type: "success",
        });
      } else {
        setShowToast({ message: result.message, type: "error" });
      }
    } catch (err) {
      if (err instanceof Error) {
        setShowToast({ message: err.message, type: "error" });
      } else {
        setShowToast({
          message: "Un error desconocido ha ocurrido.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="m-auto mt-10 flex w-full flex-col items-center justify-center md:w-1/2 lg:w-1/3">
      <Label
        htmlFor="dropzone-file"
        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          {fileLoaded ? (
            <FaCheckCircle className="size-7 text-green-600" />
          ) : (
            <FaCloudArrowUp className="size-7 text-black text-opacity-60" />
          )}
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click para cargar</span> o arrastra
            y suelta
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG</p>
        </div>
        <FileInput
          id="dropzone-file"
          className="hidden"
          onChange={handleFileChange}
        />
      </Label>
      {<div className="mt-2 text-sm text-red-500">{error ? error : ""}</div>}
      {file && (
        <div>
          <div className="mt-2 w-full text-sm text-gray-500 dark:text-gray-400">
            {`Archivo cargado: ${file.name}`}
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-5">
            <Button
              className="mt-5 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={handleSubmit}
              isProcessing={loading}
              disabled={loading}
            >
              Subir
            </Button>
          </div>
        </div>
      )}
      <div className="mt-5 w-full text-justify">
        <p>
          Arrastra y suelta tus archivos CSV en el área indicada o haz clic para
          seleccionarlos manualmente. Asegúrate de que los archivos contengan
          datos de analíticas estructurados correctamente. El formato debe
          incluir las columnas fecha, categoría y valor (Date, Category, Value)
          para un procesamiento exitoso
        </p>
      </div>
      {showToast ? (
        <div className="mt-10 flex w-full justify-center">
          <Toast>
            {showToast.type === "success" ? (
              <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="size-5" />
              </div>
            ) : (
              <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="size-5" />
              </div>
            )}
            <div className="ml-3 text-sm font-normal">{showToast.message}</div>
            <Toast.Toggle />
          </Toast>
        </div>
      ) : null}
    </div>
  );
}

export default UploadDataPage;

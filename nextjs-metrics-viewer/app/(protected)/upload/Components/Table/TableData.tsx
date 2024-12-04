"use client";
import { Button, Table } from "flowbite-react";
import { FaFileCsv } from "react-icons/fa";
import { ReadCSV } from "@/utils/utils";
import { useState, useEffect } from "react";
import { GoPlus } from "react-icons/go";
import AddModal from "../Modal/AddData";
export default function TableData() {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [addData, setAddData] = useState<object | null>(null);
  const handleSave = (res: any) => setData((prevData) => [...prevData, res]);
  const handleFileUpload = async (files: FileList | null) => {
    try {
      if (files) {
        const file = files[0];
        const result = await ReadCSV(file);
        setData((prevData) => {
          return prevData ? [...prevData, ...result] : result;
        });
      } else {
        console.log("Not file: ", files);
      }
    } catch (error) {
      console.error("Error al leer el archivo CSV:", error);
    }
  };

  useEffect(() => {
    if (addData) {
      handleSave(addData);
    }
  }, [addData]);
  return (
    <>
      <div className="my-5 flex w-full flex-row items-center justify-end">
        <Button className="relative" color="success" pill>
          <input
            type="file"
            className="absolute inset-0 z-30 mx-auto size-full opacity-0"
            accept=".csv"
            onChange={(e) => {
              handleFileUpload(e.target.files);
            }}
          />
          <FaFileCsv className="mr-2 size-5" />
          Upload CSV
        </Button>
      </div>
      <div className="my-5 flex w-full flex-row items-center justify-start">
        <Button pill onClick={() => setOpenAdd(true)}>
          <GoPlus className="mr-2 size-5" />
          Add data
        </Button>
      </div>
      <div className="z-0 w-80 overflow-x-auto md:w-full">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Value</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data &&
              data.map((data, index) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell>{data.Date}</Table.Cell>
                    <Table.Cell>{data.Category}</Table.Cell>
                    <Table.Cell>${parseFloat(data.Value)}</Table.Cell>
                    <Table.Cell>
                      <a
                        href="#"
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                      >
                        Edit
                      </a>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
      <div className="my-10 flex items-center justify-center">
        <Button color="success" pill disabled={!data}>
          Save data
        </Button>
      </div>
      <AddModal
        open={openAdd}
        onClose={(b: boolean) => setOpenAdd(b)}
        onSave={(res: any) => {
          setAddData(res);
        }}
      />
    </>
  );
}

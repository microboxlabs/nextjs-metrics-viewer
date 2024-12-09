"use client";
import { Button, Spinner, Table } from "flowbite-react";
import { FaFileCsv } from "react-icons/fa";
import { ReadCSV } from "@/lib/utils/utils";
import { useState, useEffect, useRef, useTransition } from "react";
import { GoPlus } from "react-icons/go";
import AddModal from "../Modal/AddData";
import EditModal from "../Modal/EditData";
import DeleteModal from "../Modal/DeleteData";
import { uploadData } from "@/app/actions/data";
import { useNotificationStore } from "@/lib/zustand/providers/NotificationStateProvider";
import io from "socket.io-client";

export default function TableData() {
  const { showToast } = useNotificationStore((store) => store);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [addData, setAddData] = useState<object | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [initialEditData, setInitialEditData] = useState<
    Record<string, string>
  >({
    Date: "",
    Category: "",
    Value: "",
  });
  const [editData, setEditData] = useState<object | null>(null);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [confirmDelete, setConfirmDelete] = useState<object | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isPendingUpload, startTransitionUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (res: any) =>
    setData((prevData) => [
      ...prevData.filter((item, index) => index != res.id),
      ...[res],
    ]);
  const handleSave = (res: any) => setData((prevData) => [...prevData, res]);
  const handleDelete = (res: any) =>
    setData((prevData) => prevData.filter((item, index) => index != res.id));

  const handleFileUpload = (files: FileList | null) => {
    startTransitionUpload(async() => {
      try {
        if (files) {
          const file = files[0];
          const result = await ReadCSV(file);
          setData((prevData) => {
            return prevData ? [...prevData, ...result] : result;
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          showToast(`No files found`, "error");
        }
      } catch (error) {
        showToast("Can not read the CSV file", "error");
      }
    })
  };

  const handleSubmit = () => {
    startTransition(() => {
      if (data.length > 0) {
        const { error } = uploadData(data);
        if (error) {
          showToast(error, "error");
        } else {
          const socket = io("http://localhost:3000");
          socket.emit("notification-server", {
            msg: "Your admin has added new data. Please check your dashboard",
          });
          showToast("Uploaded Files", "success");
        }
      } else {
        showToast("No data to upload", "error");
      }
    })
  };

  useEffect(() => {
    if (addData) {
      handleSave(addData);
    }
  }, [addData]);

  useEffect(() => {
    if (editData) {
      handleEdit(editData);
    }
  }, [editData]);

  useEffect(() => {
    if (confirmDelete) {
      handleDelete(confirmDelete);
    }
  }, [confirmDelete]);

  return (
    <>
      <div className="my-5 flex w-full flex-row items-center justify-end">
        <Button className="relative mr-10" color="success" pill disabled={isPendingUpload}>
          <input
            type="file"
            className="absolute inset-0 z-30 mx-auto size-full opacity-0"
            accept=".csv"
            onChange={(e) => {
              handleFileUpload(e.target.files);
            }}
            ref={fileInputRef}
          />
          {
            isPendingUpload ? (<>
              <Spinner/>
              Uploading Files...
            </>): (
              <>
              <FaFileCsv className="mr-2 size-5" />
              Upload CSV
              </>
            )
          }
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
            <Table.HeadCell className="text-center">Actions</Table.HeadCell>
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
                    <Table.Cell className="flex items-center justify-evenly">
                      <Button
                        size="small"
                        pill
                        onClick={() => {
                          setInitialEditData({ id: index.toString(), ...data });
                          setOpenEdit(true);
                        }}
                        className="w-16"
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        pill
                        className="w-16"
                        color="failure"
                        onClick={() => {
                          setIdDelete(index);
                          setOpenDelete(true);
                        }}
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
      <div className="my-10 flex items-center justify-center">
        <Button
          color="success"
          pill
          disabled={data.length <= 0 || isPending}
          onClick={() => handleSubmit()}
        >
          {
            isPending ? (
              <>
                <Spinner/>
                Loading...
              </>
            ): (
              <>Save data</>
            )
          }
        </Button>
      </div>
      <AddModal
        open={openAdd}
        onClose={(b: boolean) => setOpenAdd(b)}
        onSave={(res: any) => {
          setAddData(res);
        }}
      />
      <EditModal
        open={openEdit}
        onClose={(b: boolean) => setOpenEdit(b)}
        onSave={(res: any) => {
          setEditData(res);
        }}
        initialData={initialEditData}
      />
      <DeleteModal
        id={idDelete}
        open={openDelete}
        onClose={(b: boolean) => setOpenDelete(b)}
        onSave={(id: number) => setConfirmDelete({ id })}
      />
    </>
  );
}

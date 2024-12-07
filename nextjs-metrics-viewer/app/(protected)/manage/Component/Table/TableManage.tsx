"use client";
import { Button, Modal, Table } from "flowbite-react";
import { useMetricsStore } from "@/lib/zustand/providers/MetricsStateProvider";
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useNotificationStore } from "@/lib/zustand/providers/NotificationStateProvider";
import io from "socket.io-client";

export default function TableManage() {
  const { showToast } = useNotificationStore((store) => store);
  const { tableData, getTableData, updateTableData, deleteTableData } =
    useMetricsStore((state) => state);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [initialData, setInitialData] = useState<{
    id: number;
    date: string;
    category: string;
    value: number;
  }>({ id: 0, date: "", category: "", value: 0 });

  const handleEditData = async (data: {
    id: number;
    date: string;
    category: string;
    value: number;
  }) => {
    const { error } = await updateTableData(data);
    setOpenEdit(false);
    if (error) {
      showToast(error, "error");
    } else {
      const socket = io("http://localhost:3000");
      socket.emit("notification-server", {
        msg: "your admin has updated data. Please check your dashboard",
      });
      showToast("Data updated successfully! ", "success");
    }
  };

  const handleDeleteData = async (id: number) => {
    const { error } = await deleteTableData(id);
    setOpenDelete(false);
    if (error) {
      showToast(error, "error");
    } else {
      const socket = io("http://localhost:3000");
      socket.emit("notification-server", {
        msg: "Your admin has deleted data. Please check your dashboard",
      });
      showToast("Data deleted successfully!", "success");
    }
  };

  useEffect(() => {
    getTableData();
  }, [getTableData]);
  return (
    <div className="overflow-scroll">
      <Table striped>
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Value</Table.HeadCell>
          <Table.HeadCell className="text-center">Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {tableData && tableData.length > 0
            ? tableData.map((data, index) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell>{data.id}</Table.Cell>
                    <Table.Cell>{data.date}</Table.Cell>
                    <Table.Cell>{data.category}</Table.Cell>
                    <Table.Cell>${data.value}</Table.Cell>
                    <Table.Cell className="flex w-full items-center justify-center gap-5">
                      <Button
                        pill
                        onClick={() => {
                          setInitialData(data);
                          setOpenEdit(true);
                        }}
                      >
                        <CiEdit className="mr-2 size-5" />
                        Edit
                      </Button>
                      <Button
                        color="failure"
                        pill
                        onClick={() => {
                          setDeleteId(data.id);
                          setOpenDelete(true);
                        }}
                      >
                        <FaTrash className="mr-2 size-5" />
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            : null}
        </Table.Body>
      </Table>
      <EditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initialData={initialData}
        onSave={(data: {
          id: number;
          date: string;
          category: string;
          value: number;
        }) => handleEditData(data)}
      />
      <DeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        id={deleteId}
        onSave={(id: number) => handleDeleteData(id)}
      />
    </div>
  );
}

interface propsEdit {
  initialData: { id: number; date: string; category: string; value: number };
  open: boolean;
  onClose: Function;
  onSave: Function;
}
interface Values {
  date: string;
  category: string;
  value: number;
}

function EditModal({ open, onClose, onSave, initialData }: propsEdit) {
  const handleClose = () => onClose(false);
  return (
    <>
      <Modal show={open} onClose={handleClose}>
        <Modal.Header>Edit Data</Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              date: initialData.date,
              category: initialData.category,
              value: initialData.value,
            }}
            onSubmit={(
              values: Values,
              { setSubmitting }: FormikHelpers<Values>,
            ) => {
              const result = {
                date: values.date,
                category: values.category,
                value: values.value.toString(),
              };
              onSave({ id: initialData.id, ...result });
              onClose(false);
              setSubmitting(false);
            }}
          >
            <Form className="grid grid-cols-1 items-center justify-center">
              <div className="my-3 flex flex-col items-center justify-center">
                <label
                  htmlFor="date"
                  className="mx-10 block text-sm font-medium"
                >
                  Date
                </label>
                <Field type="date" id="date" name="date" />
              </div>
              <div className="my-3 flex flex-col items-center justify-center">
                <label
                  htmlFor="category"
                  className="mx-10 block text-sm font-medium"
                >
                  Category
                </label>
                <Field type="text" id="category" name="category" />
              </div>
              <div className="my-3 flex flex-col items-center justify-center">
                <label
                  htmlFor="value"
                  className="mx-10 block text-sm font-medium"
                >
                  Value
                </label>
                <Field type="number" min={0} id="value" name="value" />
              </div>
              <Button className="my-3" type="submit">
                Submit
              </Button>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

interface propsDelete {
  id: number;
  open: boolean;
  onClose: Function;
  onSave: Function;
}

function DeleteModal({ id, open, onClose, onSave }: propsDelete) {
  const handleClose = () => onClose(false);
  const handleDelete = () => {
    handleClose();
    onSave(id);
  };
  return (
    <Modal show={open} onClose={handleClose}>
      <Modal.Header>Edit Data</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p>Delete data n° {id}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="failure" onClick={() => handleDelete()}>
          Delete
        </Button>
        <Button color="gray" onClick={() => handleClose()}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

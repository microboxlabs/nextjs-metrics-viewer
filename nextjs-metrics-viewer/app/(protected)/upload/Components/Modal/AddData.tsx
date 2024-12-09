import { Button, Modal } from "flowbite-react";
import { Formik, Field, Form, FormikHelpers } from "formik";
interface props {
  open: boolean;
  onClose: Function;
  onSave: Function;
}
interface Values {
  date: string;
  category: string;
  price: number;
}
export default function AddModal({ open, onClose, onSave }: props) {
  const handleClose = () => onClose(false);
  return (
    <>
      <Modal show={open} onClose={handleClose}>
        <Modal.Header>Add Data</Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              date: "",
              category: "",
              price: 0,
            }}
            onSubmit={(
              values: Values,
              { setSubmitting }: FormikHelpers<Values>,
            ) => {
              const result = {
                Date: values.date,
                Category: values.category,
                Value: values.price.toString(),
              };
              onSave(result);
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
                  htmlFor="price"
                  className="mx-10 block text-sm font-medium"
                >
                  Price
                </label>
                <Field type="number" min={0} id="price" name="price" />
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

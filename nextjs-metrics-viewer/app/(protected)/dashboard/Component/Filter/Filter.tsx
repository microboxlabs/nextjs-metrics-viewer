import { Formik, Field, Form, FormikHelpers } from "formik";
import { Button, Label, Select } from "flowbite-react";

export interface FilterValues {
  date: string;
  category: string;
}

export interface props {
  categories: { category: string }[];
  onFilterAplied: Function;
}
export default function FilterComponent({ categories, onFilterAplied }: props) {
  return (
    <Formik
      initialValues={{
        date: "",
        category: "",
      }}
      onSubmit={(
        value: FilterValues,
        { setSubmitting }: FormikHelpers<FilterValues>,
      ) => {
        const data = {};
        if (value.date != "") {
          Object.assign(data, { date: value.date });
        }
        if (value.category != "") {
          Object.assign(data, { category: value.category });
        }
        onFilterAplied(data);
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, handleBlur }) => (
        <Form className="flex size-full flex-col items-center justify-evenly md:flex-row">
          <div className="flex flex-row items-center justify-center">
            <Label
              htmlFor="date"
              className="mx-1 text-base font-normal"
              value="Date: "
            />
            <Field type="date" name="date" id="date" />
          </div>
          <div className="flex flex-row items-center justify-center">
            <Label
              htmlFor="category"
              className="mx-1 text-base font-normal"
              value="Category: "
            />
            <Field as="select" id="category" name="category">
              <option value="">Select a Category</option>
              {categories &&
                categories.map((data, index) => {
                  return (
                    <option key={index} value={data.category}>
                      {data.category}
                    </option>
                  );
                })}
            </Field>
          </div>
          <div>
            <Button size="small" type="submit" color="success" className="p-1">
              Apply filters
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

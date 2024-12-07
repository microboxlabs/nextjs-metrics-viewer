import { Formik, Field, Form, FormikHelpers } from "formik";
import { Button, Label, Select, Datepicker } from "flowbite-react";

export interface FilterValues {
  fromDate: string;
  toDate: string;
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
        fromDate: "",
        toDate: "",
        category: "",
      }}
      onSubmit={(
        value: FilterValues,
        { setSubmitting }: FormikHelpers<FilterValues>,
      ) => {
        const data = {};
        if (value.fromDate != "" && value.toDate !== "") {
          Object.assign(data, {
            date: {
              lte: new Date(value.toDate).toISOString(),
              gte: new Date(value.fromDate).toISOString(),
            },
          });
        }
        if (value.category != "") {
          Object.assign(data, { category: value.category });
        }
        onFilterAplied(data);
        setSubmitting(false);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="flex size-full flex-col items-center justify-evenly md:flex-row">
          <div className="flex flex-row items-center justify-center">
            <Label
              htmlFor="fromDate"
              className="mx-1 text-base font-normal"
              value="Date From: "
            />
            <input
              type="date"
              onChange={(e) => setFieldValue("fromDate", e.target.value)}
              id="fromDate"
              name="fromDate"
            ></input>
          </div>
          <div className="flex flex-row items-center justify-center">
            <Label
              htmlFor="toDate"
              className="mx-1 text-base font-normal"
              value="Date To: "
            />
            <input
              type="date"
              onChange={(e) => setFieldValue("toDate", e.target.value)}
              id="toDate"
              name="toDate"
            ></input>
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

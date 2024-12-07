"use client";

import { FileInput, Label } from "flowbite-react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { UpdateUser } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/app/actions/auth-actions";

export interface ProfileInitialValues {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  id: string;
  name: string;
  lastname: string;
  email: string;
}

export default function ProfileEditForm({ id, name, lastname, email }: Props) {
  const router = useRouter();

  const initialValues: ProfileInitialValues = {
    name: name || "",
    lastname: lastname || "",
    email: email || "",
    password: "",
    confirmPassword: "",
  };

  return (
    <Formik<ProfileInitialValues>
      initialValues={initialValues}
      onSubmit={async (
        values: ProfileInitialValues,
        { setSubmitting }: FormikHelpers<ProfileInitialValues>,
      ) => {
        try {
          const response = await UpdateUser(parseInt(id), values);
          setSubmitting(false);
          if (response.error) {
            console.log(response.error);
          } else {
            await signOutAction();
            router.push("/");
          }
        } catch (error) {
          console.error("Error updating user:", error);
          setSubmitting(false);
        }
      }}
    >
      <Form className="my-6 flex w-5/6 flex-col items-center justify-center">
        <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="mb-1 block text-sm font-medium"
            >
              Lastname
            </label>
            <Field
              type="text"
              id="lastname"
              name="lastname"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium"
            >
              Confirm Password
            </label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full rounded-md border p-2"
            />
          </div>
        </section>
        <button
          type="submit"
          className="w-52 rounded-md bg-[#B1F0F7] p-2 transition-colors hover:bg-[#81BFDA] md:w-64"
        >
          Save
        </button>
      </Form>
    </Formik>
  );
}

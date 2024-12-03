"use client";

import { RegisterAction } from "@/actions/auth-actions";
import { startTransition, useTransition } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";

import { useRouter } from "next/navigation";
export interface RegisterValues {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <Formik
      initialValues={{
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={(
        values: RegisterValues,
        { setSubmitting }: FormikHelpers<RegisterValues>,
      ) => {
        startTransition(async () => {
          const response = await RegisterAction(values);
          setSubmitting(false);
          if (response.error) {
            console.log(response.error);
          } else {
            router.push("/");
          }
        });
      }}
    >
      <Form className="absolute m-auto w-96 rounded-lg bg-slate-50 p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Register</h1>
        <section className="mb-6 grid grid-cols-1 gap-6">
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
          <div>
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
          className="w-full rounded-md bg-[#B1F0F7] p-2 transition-colors hover:bg-[#81BFDA]"
          disabled={isPending}
        >
          Register
        </button>
        <button
          className="mt-2 w-full rounded-md bg-[#F5F0CD] p-2 transition-colors hover:bg-[#FADA7A]"
          onClick={() => {
            router.push("/");
          }}
          type="button"
        >
          Login
        </button>
      </Form>
    </Formik>
  );
}

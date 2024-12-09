"use client";

import { RegisterAction } from "@/app/actions/auth-actions";
import { useTransition } from "react";
import { useNotificationStore } from "@/lib/zustand/providers/NotificationStateProvider";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { registerSchema } from "./Schemas/RegisterSchema";
import { useRouter } from "next/navigation";
import {Spinner} from "flowbite-react"
export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const { showToast } = useNotificationStore((store) => store);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={registerSchema}
      onSubmit={(
        values: RegisterValues,
        { setSubmitting }: FormikHelpers<RegisterValues>,
      ) => {
        startTransition(async () => {
          const { error } = await RegisterAction(values);
          setSubmitting(false);
          if (error) {
            showToast(error, "error");
          } else {
            router.push("/");
          }
        });
      }}
    >
      {({ errors, touched }) => (
        <Form className="h-5/6 w-full p-10">
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
              {errors.name && touched.name ? (
                <p className="text-base font-semibold text-red-500">
                  {errors.name}
                </p>
              ) : null}
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
              {errors.email && touched.email ? (
                <p className="text-base font-semibold text-red-500">
                  {errors.email}
                </p>
              ) : null}
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
              {errors.password && touched.password ? (
                <p className="text-base font-semibold text-red-500">
                  {errors.password}
                </p>
              ) : null}
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
              {errors.confirmPassword && touched.confirmPassword ? (
                <p className="text-base font-semibold text-red-500">
                  {errors.confirmPassword}
                </p>
              ) : null}
            </div>
          </section>
          <button
            type="submit"
            className="w-full rounded-md bg-[#B1F0F7] p-2 transition-colors hover:bg-[#81BFDA]"
            disabled={isPending}
          >
            {
              isPending?(<>
                <Spinner className="mr-3"/>
                Loading...
              </>) : (
                <>Register</>
              )
            }
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
      )}
    </Formik>
  );
}

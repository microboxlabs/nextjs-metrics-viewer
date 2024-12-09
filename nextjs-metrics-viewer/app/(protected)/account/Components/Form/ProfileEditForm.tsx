"use client";

import { Formik, Field, Form, FormikHelpers } from "formik";
import { UpdateUser } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/app/actions/auth-actions";
import { userSchema } from "./Schemas/ValidationSchema";
import { useNotificationStore } from "@/lib/zustand/providers/NotificationStateProvider";
import { useTransition } from "react";
import { Spinner } from "flowbite-react";
export interface ProfileInitialValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  id: string;
  name: string;
  email: string;
}

export default function ProfileEditForm({ id, name, email }: Props) {
  const {showToast} = useNotificationStore((store) => store)
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialValues: ProfileInitialValues = {
    name: name || "",
    email: email || "",
    password: "",
    confirmPassword: "",
  };

  return (
    <Formik<ProfileInitialValues>
      initialValues={initialValues}
      validationSchema={userSchema}
      onSubmit={(
        values: ProfileInitialValues,
        { setSubmitting }: FormikHelpers<ProfileInitialValues>,
      ) => {
        startTransition(async() => {
          console.log(id)
          try {
            const name = values.name
            const email = values.email
            const password = values.password
  
            const response = await UpdateUser(id, {name, email, password});
            setSubmitting(false);
            if (response.error) {
              showToast(response.error, 'error');
            } else {
              await signOutAction();
              router.push("/");
            }
          } catch (error) {
            console.error("Error updating user:", error);
            setSubmitting(false);
          }
        })
      }}
    >
      {({ errors, touched }) => (
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
              {errors.name && touched.name ? (
                <p className="text-base font-semibold text-red-500">
                  {errors.name}
                </p>
              ) : null}
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
            className="w-52 rounded-md bg-[#B1F0F7] p-2 transition-colors hover:bg-[#81BFDA] md:w-64"
            disabled={isPending}
          >
            {
              isPending ? (<>
                <Spinner className="mr-3"/>
                Saving...
              </>) : (
                <>
                  Save
                </>
              )
            }
          </button>
        </Form>
      )}
    </Formik>
  );
}

"use client";
import { loginAction } from "@/app/actions/auth-actions";
import { useTransition } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useNotificationStore } from "@/lib/zustand/providers/NotificationStateProvider";
import { useRouter } from "next/navigation";
import { LoginSchema } from "./Schemas/LoginSchema";
import { Spinner } from "flowbite-react";
export interface Values {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { showToast } = useNotificationStore((state) => state);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        startTransition(async () => {
          const response = await loginAction(values);
          setSubmitting(false);
          if (response.error) {
            showToast(response.error, "error");
          } else {
            router.push("/dashboard");
          }
        });
      }}
    >
      {({ errors, touched }) => (
        <Form className="h-96 w-full p-10">
          <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
          <div className="mb-4">
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
          <div className="mb-6">
            <label
              htmlFor="password"
              className=" mb-1 block text-sm font-medium"
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
             <p className="text-base font-semibold text-red-500">{errors.password}</p>
           ) : null}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#B1F0F7] p-2 transition-colors hover:bg-[#81BFDA]"
            disabled={isPending}
          >
            {
              isPending ? (
                <>
                  <Spinner className="mr-3"/>
                  Loading...
                </>
              ) : (<>Login</>)
            }
          </button>
          <button
            className="mt-2 w-full rounded-md bg-[#F5F0CD] p-2 transition-colors hover:bg-[#FADA7A]"
            onClick={() => {
              router.push("/register");
            }}
            type="button"
          >
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
}

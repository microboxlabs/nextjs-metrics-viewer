"use client";
import { signIn } from "next-auth/react";
import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState(false);
  const router = useRouter();

  const formAction = async (formData: FormData) => {
    const formCredentials = Object.fromEntries(formData);
    const response = await signIn("credentials", {
      ...formCredentials,
      redirect: false,
    });

    if (response?.error) {
      setError(true);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-8">
      <form className="flex flex-col gap-4" action={formAction}>
        <div>
          <div className="mb-2 block">
            <Label className="text-white" htmlFor="name" value="Name" />
          </div>
          <TextInput
            id="name"
            name="name"
            type="text"
            placeholder="Jhon Wick"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label className="text-white" htmlFor="password" value="Password" />
          </div>
          <TextInput
            id="password"
            name="password"
            type="password"
            placeholder="********"
            required
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>

      {error && <p className="mt-2 text-red-500">Wrong credentials</p>}
    </div>
  );
}

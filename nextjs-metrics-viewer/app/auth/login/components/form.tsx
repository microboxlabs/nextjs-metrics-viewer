import { Button, FloatingLabel } from "flowbite-react";
import { useState } from "react";

type Props = {
  children?: React.ReactNode;
};

function LoginFormComponent({ children }: Props) {
  const [email, setEmail] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail({ ...email, [e.target.name]: e.target.value });
  }

  return (
    <form className="flex flex-col gap-2">
      <FloatingLabel
        variant="filled"
        label="Correo electrónico"
        name="email"
        onChange={handleChange}
      />
      <FloatingLabel
        variant="filled"
        label="Contraseña"
        name="password"
        type="password"
        onChange={handleChange}
      />
      <div className="mt-5 flex w-full items-center justify-center">
        <Button type="submit" color="blue" className="w-full">
          Ingresar
        </Button>
      </div>
      {children}
    </form>
  );
}

export default LoginFormComponent;

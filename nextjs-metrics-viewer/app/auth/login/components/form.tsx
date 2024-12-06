import { Button, FloatingLabel } from "flowbite-react";
import { useState } from "react";

type Props = {
  children?: React.ReactNode;
};

function LoginFormComponent({ children }: Props) {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    },
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Ocurrió un error inesperado");
        return;
      }

      const data = await response.json();
      console.log("Login exitoso:", data);

      localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Error durante la solicitud:", err);
      setError("Ocurrió un error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
      <div className="mt-5 flex w-full flex-col items-center justify-center gap-2">
        <Button
          type="submit"
          color="blue"
          className="w-full"
          isProcessing={loading}
          disabled={loading}
        >
          Ingresar
        </Button>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </div>
      {children}
    </form>
  );
}

export default LoginFormComponent;

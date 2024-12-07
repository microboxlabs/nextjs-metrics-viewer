import { Button, FloatingLabel } from "flowbite-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  children?: React.ReactNode;
};

function LoginFormComponent({ children }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (!response || !response.ok || response.error) {
        setError(response?.error || "Ocurrió un error inesperado");
        return;
      }
    } catch (err) {
      console.error("Error durante la solicitud:", err);
      setError("Ocurrió un error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <div className="flex flex-col">
        <FloatingLabel
          variant="filled"
          label="Correo electrónico"
          color={errors.email ? "error" : "default"}
          {...register("email", {
            required: {
              value: true,
              message: "Correo electrónico es requerido",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message as string}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <FloatingLabel
          variant="filled"
          label="Contraseña"
          type="password"
          color={errors.password ? "error" : "default"}
          {...register("password", {
            required: {
              value: true,
              message: "Contraseña es requerida",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message as string}
          </p>
        )}
      </div>
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

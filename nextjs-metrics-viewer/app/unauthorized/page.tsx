import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-md">
        <h1 className="text-4xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="mt-4 text-gray-600">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="mb-4 text-4xl font-bold text-red-500">404 - Page Not Found</h1>
        <p className="mb-4 text-gray-700">
          Sorry, the page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Back to Home
        </a>
      </main>
    );
  }
  
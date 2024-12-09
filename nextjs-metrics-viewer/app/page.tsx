import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-black px-6 py-32">
      <h1 className="text-2xl text-white">Login</h1>

      <LoginForm />
    </main>
  );
}

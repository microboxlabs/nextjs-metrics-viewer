import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-black px-6 py-32">
      <h1 className="self-center whitespace-nowrap text-2xl font-semibold text-[#00BBCF]">
        MicroboxLabs
      </h1>

      <LoginForm />
    </main>
  );
}

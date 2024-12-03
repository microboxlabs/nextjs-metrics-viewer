import RegisterForm from "@/components/Register/RegisterComponent";
import Background from "@/public/background";
export default function Register() {
  return (
    <main className="relative flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <div className="hidden h-screen w-screen sm:block">
        <Background className="size-full object-cover" />
      </div>
      <RegisterForm />
    </main>
  );
}

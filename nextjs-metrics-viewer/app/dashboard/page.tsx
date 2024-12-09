import Header from "@/components/Header";
import dynamic from "next/dynamic";

const DynamicMetricsSection = dynamic(
  () => import("@/components/MetricsSection"),
  {
    ssr: false,
  },
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-black px-6 py-32">
      <Header />
      <h1 className="text-2xl text-white">Dashboard</h1>

      <DynamicMetricsSection />
    </main>
  );
}

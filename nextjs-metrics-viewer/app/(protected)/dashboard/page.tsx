import DashboardComponent from "./Component/Dashboard/Dashboard";
import { getCategories } from "@/app/actions/data";
export default async function DashboardPage() {
  const categories = await getCategories();
  return (
    <>
      <DashboardComponent categories={categories} />
    </>
  );
}

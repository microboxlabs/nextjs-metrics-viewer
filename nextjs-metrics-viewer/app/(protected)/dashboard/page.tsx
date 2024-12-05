import DashboardComponent from "./Component/Dashboard/Dashboard";
import { getAllData, getCategories } from "@/actions/data";
export default async function DashboardPage() {
  const categories = await getCategories();
  return (
    <>
      <DashboardComponent categories={categories} />
    </>
  );
}

import Divider from "@/app/components/Divider/DividerComponent";
import Link from "next/link";
import TableManage from "../Table/TableManage";
export default function ManageComponent() {
  return (
    <>
      <h1 className="text-2xl">Manage data</h1>
      <Divider />
      <p>
        In this section you can manage existing data in the system. If you want
        to add new data, you have to go{" "}
        <span>
          <Link href="/upload" className="text-green-400 underline">
            Here!
          </Link>
        </span>
      </p>
      <div className="my-10 flex w-full items-center justify-center">
        <div className="max-h-96 w-96 shadow-lg md:w-5/6">
          <TableManage />
        </div>
      </div>
    </>
  );
}

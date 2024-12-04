import Divider from "@/components/Divider/DividerComponent";
import { Button } from "flowbite-react";
import { FaFileCsv } from "react-icons/fa";
import TableData from "./Components/Table/TableData";
export default function UploadPage() {
  return (
    <>
      <h1 className="text-2xl">Upload Data</h1>
      <Divider />
      <section className="my-6">
        <p className="text-base font-semibold">
          You can upload data from CSV file or add manually.
        </p>
        <p className="my-3 text-base font-semibold">
          Once finished, you have to save your changes to apply.
        </p>
        <p className="my-3 text-base font-semibold">
          The headers in CSV must be Date, Category, Value. Otherwise, the data will not be uploaded
        </p>
        <TableData />
      </section>
    </>
  );
}

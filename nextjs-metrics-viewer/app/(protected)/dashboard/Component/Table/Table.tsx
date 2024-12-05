import { Table } from "flowbite-react";
interface props {
    data: {
        date: string,
        category: string,
        value: number
    }[] | undefined
}
export default function TableComponent({data}:props){
    return (
        <div className="overflow-scroll">
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Value</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {data &&
                  data.map((data, index) => {
                    return (
                      <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={index}
                      >
                        <Table.Cell>{data.date}</Table.Cell>
                        <Table.Cell>{data.category}</Table.Cell>
                        <Table.Cell>${data.value}</Table.Cell>
                      </Table.Row>
                    );
                  })}
              </Table.Body>
            </Table>
        </div>
           
      );
}
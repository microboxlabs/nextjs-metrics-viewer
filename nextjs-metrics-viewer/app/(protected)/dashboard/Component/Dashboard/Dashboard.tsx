"use client";

import Divider from "@/components/Divider/DividerComponent";
import { useState, useEffect, use } from "react";
import { getAllData, getCategories } from "@/actions/data";
import ChartComponent from "../Chart/Chart";
import TableComponent from "../Table/Table";
import FilterComponent from "../Filter/Filter";

export interface IData {
  total: number;
  min: number;
  max: number;
  avg: number;
  data: {
    date: string;
    categories: {
      category: string;
      value: number;
    }[];
  }[];
  dataTable:{
    date: string;
    category: string;
    value: number
  }[]
}

export default function DashboardComponent() {
  const [data, setData] = useState<IData | null>(null);
  const [cateogries, setCategories] = useState<{category: string}[]>([]);
  const styles = {
    cardContainer: "size-60 rounded-lg bg-slate-100 shadow-lg",
    cardHeaderContainer:"mt-5 flex size-5 h-10 w-full items-center justify-center",
    cardDataContainer:"mt-5 flex size-5 h-24 w-full items-center justify-center"
  }
  const FetchData = async (filter = {}) => {
    const { response, error } = await getAllData(filter);
    if (response) {
      setData(response);
    } else {
      console.log(error);
    }
  };
  const FetchCategories = async() =>{
    setCategories(await getCategories())

  }
  useEffect(() => {
    FetchData();
    FetchCategories();
  }, []);
  return (
    <>
      <h1 className="text-2xl">Dashboard</h1>
      <Divider />
      <div className="my-5 flex size-96 flex-col items-center justify-center md:h-10 md:w-full md:flex-row">
        <p className="text-lg">Filters:</p>
        <FilterComponent categories={cateogries} onFilterApllied={async(values:{date:string; category:string;}) => {await FetchData(values)}}/>
      </div>
      <section className="flex w-full flex-col gap-10 xl:flex-row xl:gap-0">
        <div className="flex w-full flex-col items-center justify-center gap-10 md:grid lg:grid-cols-2 xl:w-2/5">
          <CardContainer header="Total" data={data ? data.total: 0} styles={styles}/>
          <CardContainer header="Min" data={data ? data.min : 0} styles={styles}/>
          <CardContainer header="Max" data={data ? data.max : 0} styles={styles}/>
          <CardContainer header="Average" data={data ? Math.trunc(data.avg *100) /100 : 0} styles={styles}/>
        </div>
        <div className="relative rounded-lg bg-slate-100 shadow-lg md:h-96 xl:w-[50rem]">
          <ChartComponent data={data ? data.data : []} />
        </div>
      </section>
      <section className="m-0 md:ml-1">
        <div className="mt-10 h-96 w-full rounded-lg bg-slate-100 shadow-lg md:h-32 md:w-[64rem]">
          <h3 className="py-5 text-center text-xl font-semibold">Total Data</h3>
          <TableComponent data={data?.dataTable}/>
        </div>        
      </section>
    </>
  );
}

interface props{
  header: string;
  data: number | undefined;
  styles: {
    cardContainer: string;
    cardHeaderContainer: string;
    cardDataContainer: string;
  }
}
function CardContainer({header,data,styles}:props){
  return(
    <div className={styles.cardContainer}>
    <div className={styles.cardHeaderContainer}>
      <h3 className="text-xl font-bold">{header}</h3>
    </div>
    <div className={styles.cardDataContainer}>
      <p className="text-4xl font-bold">{data}</p>
    </div>
  </div>
  )
}
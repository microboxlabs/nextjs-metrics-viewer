"use server";
import { prisma } from "@/prisma";
import { IData } from "@/app/(protected)/dashboard/Component/Dashboard/Dashboard";

/**
 * A function that receives the data to be uploaded and performs the database entry. Returns an upload success object or an error object.
 * @param data  - an Record's array with the data to be uploaded
 * @returns a success object or an error object
 */
export const uploadData = (data: Record<string, string>[]) => {
  try {
    data.forEach(async (metric) => {
      const reqData = {
        date: metric.Date,
        category: metric.Category,
        value: parseFloat(metric.Value),
      };
      const res = await prisma.metrics.findFirst({
        where: { date: metric.Date, category: metric.Category },
      });
      if (res) {
        await prisma.metrics.update({
          where: { id: res.id },
          data: reqData,
        });
      } else {
        await prisma.metrics.create({
          data: reqData,
        });
      }
    });
    return { success: true };
  } catch (error) {
    return { error: "Error trying upload Data. Please try again" };
  }
};
/**
 * A function that gets all data in the database, aplying user's filters.
 * @param filters - An Object with the user's filters
 * @returns an Object with the min, the max,the total, the average, chart's data and table's data
 */
export const getAllData = async (filters: any = {}): Promise<IData | null> => {
  try {
    const data = await prisma.metrics.findMany({
      where: filters,
    });
    if (data.length > 0) {
      const total = data.reduce((accumulator, current) => accumulator + 1, 0);
      const min = Math.min(...data.map((iteration: any) => iteration.value));
      const max = Math.max.apply(
        null,
        data.map((iteration: any) => iteration.value),
      );
      const avg =
        data.reduce((acc: any, curr: any) => acc + curr.value, 0) / data.length;
      const parsedData = groupDataByDate(data);
      return {
        min,
        max,
        total,
        avg,
        data: parsedData,
        dataTable: data,
      };
    } else {
      return {
        min: 0,
        max: 0,
        total: 0,
        avg: 0,
        data: [],
        dataTable: [],
      };
    }
  } catch (error) {
    return null;
  }
};
/**
 * A function that group the data by the date.
 * @param data  - An Object with date, category, value and id
 * @returns An Array with the grouped data or an empty Array if there is no data
 */
function groupDataByDate(
  data: { date: string; category: string; value: number; id: number }[],
) {
  if (data.length > 0) {
    return data.reduce((acc: any, { date, category, value }: any) => {
      const entry = acc.find((item: any) => item.date === date);
      if (!entry) {
        acc.push({
          date,
          categories: [{ category, value }],
        });
      } else {
        entry.categories.push({ category, value });
      }
      return acc;
    }, []);
  }
  return data;
}
/**
 * A function that get all categories from database. The data will be show in dashboard category filter input
 * @returns An Array with all categories or an empty Array if there is no data
 */
export async function getCategories() {
  const categories = await prisma.metrics.groupBy({
    by: ["category"],
  });
  if (categories) {
    return categories.map((data) => data)
  }
  return [];
}
/**
 * A function that get all data in database to be managed in Manage Data
 * @returns An Array with all data in database or an empty Array if there is no data
 */
export async function getTableData() {
  try {
    const data = await prisma.metrics.findMany();
    return { data };
  } catch (error) {
    return { error: "Error 500" };
  }
}

/**
 * A function that update a data in database.
 * @param data - An object with id, date, category and value
 * @returns a success object or an error object
 */
export async function updateTableData(data: {
  id: number;
  date: string;
  category: string;
  value: number;
}) {
  try {
    const metrics = await prisma.metrics.update({
      where: { id: data.id },
      data: {
        category: data.category,
        date: data.date,
        value: +data.value,
      },
    });
    if (metrics) {
      return { success: true };
    }
    return { error: "There is no data for update" };
  } catch (error) {
    return { error: "Error 500" };
  }
}

/**
 * A function that delete a data in database.
 * @param id - id of the data to be deleted
 * @returns a success object or an error object
 */
export async function deleteTableData(id: number) {
  try {
    await prisma.metrics.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { error: "Error 500" };
  }
}

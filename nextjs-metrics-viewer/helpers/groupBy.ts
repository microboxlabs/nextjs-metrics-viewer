// helpers/groupBy.ts
export const groupByCategory = (data: { category: string; value: number }[]) => {
    return data.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.value;
        return acc;
    }, {} as Record<string, number>);
};

export const groupByDate = (data: { date: string; value: number }[]) => {
    return data.reduce((acc, curr) => {
        acc[curr.date] = (acc[curr.date] || 0) + curr.value;
        return acc;
    }, {} as Record<string, number>);
};

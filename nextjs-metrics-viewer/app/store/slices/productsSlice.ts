import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Product {
  id: string;
  date: string;
  category: string;
  value: number
}

interface ProductsState {
  products: Product[];
  totalSales: number;
  totalExpenses: number;
  totalMarketing: number;
  avgSales: number;
  avgExpenses: number;
  avgMarketing: number;
  minSales: number;
  maxSales: number;
  minExpenses: number;
  maxExpenses: number;
  minMarketing: number;
  maxMarketing: number;
  chartData: { dates: string[], sales: number[], expenses: number[], marketing: number[] };
}

const initialState: ProductsState = {
  products: [],
  totalSales: 0,
  totalExpenses: 0,
  totalMarketing: 0,
  avgSales: 0,
  avgExpenses: 0,
  avgMarketing: 0,
  minSales: 0,
  maxSales: 0,
  minExpenses: 0,
  maxExpenses: 0,
  minMarketing: 0,
  maxMarketing: 0,
  chartData: { dates: [], sales: [], expenses: [], marketing: [] },
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      const groupedData = groupProductsByDateAndCategory(action.payload);
      state.products = groupedData.products;
      state.chartData = {
        dates: groupedData.dates,
        sales: groupedData.sales,
        expenses: groupedData.expenses,
        marketing: groupedData.marketing,
      };
      calculateTotals(state);
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      const updatedProducts = [...state.products, action.payload];
      const groupedData = groupProductsByDateAndCategory(updatedProducts);
      state.products = groupedData.products;
      state.chartData = {
        dates: groupedData.dates,
        sales: groupedData.sales,
        expenses: groupedData.expenses,
        marketing: groupedData.marketing,
      };
      calculateTotals(state);
    },
  }
})

function groupProductsByDateAndCategory(products: Product[]): { products: Product[], dates: string[], sales: number[], expenses: number[], marketing: number[] } {
  const dates = Array.from(new Set(products.map(p => p.date)));
  
  const sales = Array(dates.length).fill(0);
  const expenses = Array(dates.length).fill(0);
  const marketing = Array(dates.length).fill(0);

  const groupedData: { products: Product[], dates: string[], sales: number[], expenses: number[], marketing: number[] } = {
    products: [],
    dates,
    sales,
    expenses,
    marketing
  };

  products.forEach(product => {
    const index = dates.indexOf(product.date);
    
    switch (product.category) {
      case 'Sales':
        groupedData.sales[index] += product.value;
        break;
      case 'Expenses':
        groupedData.expenses[index] += product.value;
        break;
      case 'Marketing':
        groupedData.marketing[index] += product.value;
        break;
    }

    groupedData.products.push(product);    
  });

  return groupedData;
}


function calculateTotals(state: ProductsState) {
  const sales = state.products.filter(p => p.category === 'Sales');
  const expenses = state.products.filter(p => p.category === 'Expenses');
  const marketing = state.products.filter(p => p.category === 'Marketing');

  state.totalSales = sales.reduce((sum, product) => sum + product.value, 0);
  state.totalExpenses = expenses.reduce((sum, product) => sum + product.value, 0);
  state.totalMarketing = marketing.reduce((sum, product) => sum + product.value, 0);

  state.avgSales = sales.length > 0 ? state.totalSales / sales.length : 0;
  state.avgExpenses = expenses.length > 0 ? state.totalExpenses / expenses.length : 0;
  state.avgMarketing = marketing.length > 0 ? state.totalMarketing / marketing.length : 0;

  state.minSales = Math.min(...sales.map(p => p.value));
  state.maxSales = Math.max(...sales.map(p => p.value));
  state.minExpenses = -Infinity ? 0 : Math.min(...expenses.map(p => p.value));
  state.maxExpenses = Infinity ? 0 : Math.max(...expenses.map(p => p.value));
  state.minMarketing = -Infinity ? 0 : Math.min(...marketing.map(p => p.value));
  state.maxMarketing = Infinity ? 0 : Math.max(...marketing.map(p => p.value));
  
}

export const { setProducts, addProduct } = productsSlice.actions;

// Sales data
export const selectTotalSales = (state: RootState) => state.products.totalSales;
export const selectAvgSales = (state: RootState) => state.products.avgSales;
export const selectMinSale = (state: RootState) => state.products.minSales;
export const selectMaxSale = (state: RootState) => state.products.maxSales;

// Expenses data
export const selectTotalExpenses = (state: RootState) => state.products.totalExpenses;
export const selectAvgExpenses = (state: RootState) => state.products.avgExpenses;
export const selectMinExpense = (state: RootState) => state.products.minExpenses;
export const selectMaxSExpense = (state: RootState) => state.products.maxExpenses;

// Marketing data
export const selectTotalMarketing = (state: RootState) => state.products.totalMarketing;
export const selectAvgMarketing = (state: RootState) => state.products.avgMarketing;
export const selectMinMarketing = (state: RootState) => state.products.minMarketing;
export const selectMaxMarketing = (state: RootState) => state.products.maxMarketing;

export const selectChartData = (state: RootState) => state.products.chartData;

export default productsSlice.reducer;
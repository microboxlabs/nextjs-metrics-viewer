'use client'

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import SummaryMetrics from "./summaryMetrics";
import { getProducts } from "../services/productsService";
import { setProducts } from "../store/slices/productsSlice";

export default function Dashboard() {

  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products);

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      try {
        const fetchProducts: any = await getProducts();
        dispatch(setProducts(fetchProducts));
      } catch (error) {
        console.log('Ha ocurrido un error', error);
      }
    };

    fetchAndSetProducts();
  }, [dispatch])


  return (
    <SummaryMetrics />
  );
}
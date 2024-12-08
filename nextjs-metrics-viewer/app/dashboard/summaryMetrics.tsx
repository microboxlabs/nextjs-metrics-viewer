
import ExpensesMetrics from "./expensesMetrics";
import MarketingMetrics from "./marketingMetrics";
import SalesMetrics from "./salesMetrics";
import LineChartMetrics from "./charts/lineChart";
import BarChartMetrics from "./charts/barChart";

export default function SummaryMetrics() {

  
  return (
    <>
      <SalesMetrics/>
      <ExpensesMetrics/>
      <MarketingMetrics/>
      <LineChartMetrics/>
      <BarChartMetrics/>
    </>
  );
}
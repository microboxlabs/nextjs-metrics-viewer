import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,       
    LinearScale,       
    RadialLinearScale, 
    PointElement,
    LineElement,
    BarElement,
    ArcElement,         
    Title,
    Tooltip,
    Legend,
    Filler              
);

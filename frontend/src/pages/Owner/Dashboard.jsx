import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data } = await axios.get("/api/users/statistics");
        if (data && Array.isArray(data)) {
          const branches = data.map((item) => item.branch);
          const usersCount = data.map((item) => item.usersCount);
          const productsCount = data.map((item) => item.productsCount);
          const ordersCount = data.map((item) => item.ordersCount);

          setChartData({
            labels: branches,
            datasets: [
              {
                label: "Users",
                data: usersCount,
                backgroundColor: "rgba(75, 192, 192, 0.8)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Products",
                data: productsCount,
                backgroundColor: "rgba(153, 102, 255, 0.8)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
              {
                label: "Orders",
                data: ordersCount,
                backgroundColor: "rgba(255, 159, 64, 0.8)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div style={{ maxWidth: "80%", maxHeight: "600px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.5rem" }}>Branch Statistics</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 20,
                },
              },
            },
            title: {
              display: true,
              text: "Number of Users, Products, and Orders per Branch",
              font: {
                size: 14,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Branches",
                font: {
                  size: 30,
                },color:"green",
              },
              ticks: {
                font: {
                  size: 20,
                },color:'yellow',
              },
            },
            y: {
              title: {
                display: true,
                text: "Count",
                font: {
                  size: 30,
                },color:"green",
              },
              ticks: {
                beginAtZero: true,
                stepSize: 1,
                font: {
                  size: 10,
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Dashboard;

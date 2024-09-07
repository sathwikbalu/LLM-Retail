import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';

const BranchProductDetails = () => {
  const [branchData, setBranchData] = useState({});

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/orderGraph');
        setBranchData(response.data);
      } catch (error) {
        console.error('Error fetching branch data', error);
      }
    };

    fetchBranchData();
  }, []);

  return (
    <div>
      {Object.keys(branchData).map(branch => (
        <div key={branch}>
          <h2>{branch} - Top 10 Products</h2>
          <Bar
            data={{
              labels: Object.keys(branchData[branch].topProducts),
              datasets: [
                {
                  label: 'Quantity Sold',
                  data: Object.values(branchData[branch].topProducts),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default BranchProductDetails;

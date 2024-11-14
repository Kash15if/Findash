import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://findash-apis.vercel.app/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (!data)
    return (
      <div style={styles.uploadContainer}>
        <input type="file" onChange={handleFileUpload} style={styles.uploadInput} />
        <p style={styles.placeholderText}>Please upload an Excel file to view the dashboard.</p>
      </div>
    );

  const { perDayBalance, perMonthCredit, perMonthDebit, totalCredit, totalDebit } = data;

  const lineData = {
    labels: Object.keys(perDayBalance),
    datasets: [
      {
        label: 'Daily Balance',
        data: Object.values(perDayBalance),
        borderColor: '#1DE9B6',
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: Object.keys(perMonthCredit),
    datasets: [
      {
        label: 'Monthly Credit',
        data: Object.values(perMonthCredit),
        backgroundColor: '#66bb6a', // Material green
      },
      {
        label: 'Monthly Debit',
        data: Object.values(perMonthDebit),
        backgroundColor: '#ef5350', // Material red
      },
    ],
  };

  const pieData = {
    labels: ['Total Credit', 'Total Debit'],
    datasets: [
      {
        data: [totalCredit, totalDebit],
        backgroundColor: ['#66bb6a', '#ef5350'], // Material green and red
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
        },
      },
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <input type="file" onChange={handleFileUpload} style={styles.uploadButton} />
      <h1 style={styles.title}>Finance Dashboard</h1>

      <div style={styles.gridContainer}>
        <div style={{ ...styles.chartContainer, ...styles.smallChart }}>
          <h2 style={styles.chartTitle}>Credit vs Debit Summary</h2>
          <Doughnut data={pieData} options={pieOptions} />
        </div>

        <div style={{ ...styles.chartContainer, ...styles.smallChart }}>
          <h2 style={styles.chartTitle}>Monthly Credit vs Debit</h2>
          <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
        </div>

        <div style={{ ...styles.chartContainer, gridColumn: '1 / span 2' }}>
          <h2 style={styles.chartTitle}>Daily Balance</h2>
          <Line data={lineData} options={{ plugins: { legend: { display: false } } }} />
        </div>

        <div style={{ ...styles.tableContainer, gridColumn: '1 / span 2' }}>
          <h2 style={styles.chartTitle}>Monthly Summary Table</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Month</th>
                <th style={styles.tableHeader}>Total Debit</th>
                <th style={styles.tableHeader}>Total Credit</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(perMonthCredit).map((month) => (
                <tr key={month}>
                  <td style={styles.tableCell}>{month}</td>
                  <td style={styles.tableCell}>{perMonthDebit[month]}</td>
                  <td style={styles.tableCell}>{perMonthCredit[month]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1e1e2f',
    color: '#ffffff',
    minHeight: '100vh',
  },
  uploadContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    backgroundColor: '#1e1e2f',
  },
  uploadInput: {
    marginBottom: '20px',
    padding: '10px',
    cursor: 'pointer',
    color: '#ffffff',
    backgroundColor: '#1DE9B6',
    border: 'none',
    borderRadius: '4px',
  },
  uploadButton: {
    float: 'right',
    padding: '8px 16px',
    margin: '10px',
    backgroundColor: '#1DE9B6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  title: {
    textAlign: 'center',
    fontSize: '26px',
    color: '#1DE9B6',
    marginBottom: '30px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  chartContainer: {
    backgroundColor: '#2a2a3c',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  smallChart: {
    maxHeight: "100%",
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '10px',
    color: '#ffffff',
  },
  tableContainer: {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#2a2a3c',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#ffffff',
  },
  tableHeader: {
    backgroundColor: '#1DE9B6',
    color: 'white',
    padding: '10px',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #4d4d5e',
    textAlign: 'center',
  },
  placeholderText: {
    color: '#888',
  },
};

export default Dashboard;

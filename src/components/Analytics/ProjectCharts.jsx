import React from 'react';
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ProjectCharts = ({ projectData, budgetData, resourceData }) => {
  // Project Progress Chart
  const progressChartData = {
    labels: projectData?.map(project => project.name) || [],
    datasets: [
      {
        label: 'Progress (%)',
        data: projectData?.map(project => project.progress) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  // Budget Distribution Chart
  const budgetChartData = {
    labels: budgetData?.map(budget => budget.category) || [],
    datasets: [
      {
        data: budgetData?.map(budget => budget.amount) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Resource Allocation Trend
  const resourceChartData = {
    labels: resourceData?.map(data => data.month) || [],
    datasets: [
      {
        label: 'Resource Allocation',
        data: resourceData?.map(data => data.allocation) || [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header>Project Progress</Card.Header>
            <Card.Body>
              <Bar
                data={progressChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    },
                    title: {
                      display: true,
                      text: 'Project Progress Overview'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header>Budget Distribution</Card.Header>
            <Card.Body>
              <Pie
                data={budgetChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right'
                    },
                    title: {
                      display: true,
                      text: 'Budget Distribution by Category'
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Card>
            <Card.Header>Resource Allocation Trend</Card.Header>
            <Card.Body>
              <Line
                data={resourceChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top'
                    },
                    title: {
                      display: true,
                      text: 'Resource Allocation Over Time'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectCharts; 
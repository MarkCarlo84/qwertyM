import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Spinner,
  Alert,
  Badge,
  ProgressBar
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { parseISO } from 'date-fns';

const BudgetReportPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/projects/budget-report', {
        headers: { Authorization: `Bearer ${token}` },
        params: dateRange
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching budget report:', error);
      setError('Failed to load budget report data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/projects/budget-report/export', {
        headers: { Authorization: `Bearer ${token}` },
        params: dateRange,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `budget-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting budget report:', error);
      setError('Failed to export budget report');
    }
  };

  const getBudgetStatusBadge = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) {
      return <Badge bg="danger">Over Budget</Badge>;
    } else if (percentage > 90) {
      return <Badge bg="warning">Near Limit</Badge>;
    } else {
      return <Badge bg="success">On Track</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Budget Report</h2>
            <Button variant="outline-primary" onClick={handleExport}>
              Export Report
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={dateRange.start_date}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={dateRange.end_date}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h4 className="mb-0">Project Budget Overview</h4>
        </Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Project</th>
                <th>Total Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>${project.total_budget.toLocaleString()}</td>
                  <td>${project.spent_amount.toLocaleString()}</td>
                  <td>${(project.total_budget - project.spent_amount).toLocaleString()}</td>
                  <td>
                    <ProgressBar 
                      now={(project.spent_amount / project.total_budget) * 100} 
                      label={`${Math.round((project.spent_amount / project.total_budget) * 100)}%`}
                      variant={
                        (project.spent_amount / project.total_budget) * 100 > 100 ? 'danger' :
                        (project.spent_amount / project.total_budget) * 100 > 90 ? 'warning' : 'success'
                      }
                    />
                  </td>
                  <td>
                    {getBudgetStatusBadge(project.spent_amount, project.total_budget)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BudgetReportPage; 
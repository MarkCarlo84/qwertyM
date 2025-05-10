import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  ProgressBar,
  Badge,
  Tabs,
  Tab
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChartLine, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const BudgetTrackingPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'overview') {
        const response = await axios.get('/api/projects/budget', { headers });
        setProjects(response.data);
      } else {
        const response = await axios.get('/api/expenses', { headers });
        setExpenses(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getBudgetStatusBadge = (status) => {
    const colors = {
      'under_budget': 'success',
      'on_track': 'info',
      'over_budget': 'danger'
    };
    return <Badge bg={colors[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const calculateBudgetUtilization = (spent, total) => {
    return (spent / total) * 100;
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Budget Tracking</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/budget/expenses/create" variant="primary">
            <FontAwesomeIcon icon={faPlus} /> Add Expense
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="overview" title="Budget Overview">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Total Budget</th>
                      <th>Spent</th>
                      <th>Remaining</th>
                      <th>Utilization</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>${project.total_budget.toLocaleString()}</td>
                        <td>${project.spent.toLocaleString()}</td>
                        <td>${(project.total_budget - project.spent).toLocaleString()}</td>
                        <td>
                          <ProgressBar
                            now={calculateBudgetUtilization(project.spent, project.total_budget)}
                            label={`${calculateBudgetUtilization(project.spent, project.total_budget).toFixed(1)}%`}
                            variant={calculateBudgetUtilization(project.spent, project.total_budget) > 90 ? 'danger' : 'primary'}
                          />
                        </td>
                        <td>{getBudgetStatusBadge(project.budget_status)}</td>
                        <td>
                          <Button
                            as={Link}
                            to={`/budget/projects/${project.id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
            <Tab eventKey="expenses" title="Expense Tracking">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(expense => (
                      <tr key={expense.id}>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>{expense.project_name}</td>
                        <td>{expense.category}</td>
                        <td>{expense.description}</td>
                        <td>${expense.amount.toLocaleString()}</td>
                        <td>
                          <Badge bg={expense.status === 'approved' ? 'success' : 'warning'}>
                            {expense.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            as={Link}
                            to={`/budget/expenses/${expense.id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
            <Tab eventKey="analytics" title="Budget Analytics">
              <Row>
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <FontAwesomeIcon icon={faChartLine} /> Budget vs Actual
                    </Card.Header>
                    <Card.Body>
                      {/* Add budget vs actual chart here */}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <FontAwesomeIcon icon={faFileInvoiceDollar} /> Expense Categories
                    </Card.Header>
                    <Card.Body>
                      {/* Add expense categories chart here */}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BudgetTrackingPage; 
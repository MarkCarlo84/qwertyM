import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Badge,
  Tabs,
  Tab,
  ProgressBar,
  Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartPie, faChartLine, faDownload } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';

const ProjectReportsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [projectReports, setProjectReports] = useState([]);
  const [riskReports, setRiskReports] = useState([]);
  const [summaryReport, setSummaryReport] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        start: dateRange.start || undefined,
        end: dateRange.end || undefined
      }).toString();

      const [projectsRes, risksRes, summaryRes] = await Promise.all([
        api.get(`/projects?${queryParams}`),
        api.get(`/risks?${queryParams}`),
        api.get(`/dashboard/stats?${queryParams}`)
      ]);

      setProjectReports(projectsRes.data || []);
      setRiskReports(risksRes.data || []);
      setSummaryReport(summaryRes.data || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch report data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const colors = {
      'on_track': 'success',
      'at_risk': 'warning',
      'delayed': 'danger'
    };
    return <Badge bg={colors[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const getRiskLevelBadge = (level) => {
    const colors = {
      'low': 'success',
      'medium': 'warning',
      'high': 'danger'
    };
    return <Badge bg={colors[level]}>{level}</Badge>;
  };

  const handleExportReport = async (type) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        start: dateRange.start || undefined,
        end: dateRange.end || undefined
      }).toString();

      const response = await api.get(`/reports/export/${type}?${queryParams}`, {
        responseType: 'blob'
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export report');
      console.error('Error exporting report:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Loading...</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Project Reports</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>Date Range Filter</Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start"
                    value={dateRange.start}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end"
                    value={dateRange.end}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button 
                  variant="primary" 
                  onClick={() => setDateRange({ start: '', end: '' })}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {summaryReport && (
        <Card className="mb-4">
          <Card.Header>Summary Report</Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Card className="text-center mb-3">
                  <Card.Body>
                    <h5>Total Projects</h5>
                    <h3>{summaryReport.total_projects || 0}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center mb-3">
                  <Card.Body>
                    <h5>Active Projects</h5>
                    <h3>{summaryReport.active_projects || 0}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center mb-3">
                  <Card.Body>
                    <h5>Total Risks</h5>
                    <h3>{summaryReport.total_risks || 0}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center mb-3">
                  <Card.Body>
                    <h5>High Priority Risks</h5>
                    <h3>{summaryReport.high_priority_risks || 0}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Project Reports</span>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => handleExportReport('projects')}
                disabled={loading}
              >
                Export
              </Button>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(projectReports) && projectReports.map(project => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.status}</td>
                      <td>{project.progress}%</td>
                      <td>${project.budget}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Risk Reports</span>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => handleExportReport('risks')}
                disabled={loading}
              >
                Export
              </Button>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Risk Description</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Project</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(riskReports) && riskReports.map(risk => (
                    <tr key={risk.id}>
                      <td>{risk.description}</td>
                      <td>{risk.priority}</td>
                      <td>{risk.status}</td>
                      <td>{risk.project_name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectReportsPage; 
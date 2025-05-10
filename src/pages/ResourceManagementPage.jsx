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
  ProgressBar
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserPlus, faChartPie } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';

const ResourceManagementPage = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [teamMembers, setTeamMembers] = useState([]);
  const [resourceAllocation, setResourceAllocation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'team') {
        const response = await api.get('/resources/team-members');
        // Ensure skills are properly parsed
        const processedData = response.data.map(member => ({
          ...member,
          skills: Array.isArray(member.skills) ? member.skills : 
                 typeof member.skills === 'string' ? JSON.parse(member.skills) : 
                 []
        }));
        setTeamMembers(processedData);
      } else {
        const response = await api.get('/resources/allocation');
        setResourceAllocation(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getAvailabilityBadge = (availability) => {
    const colors = {
      high: 'success',
      medium: 'warning',
      low: 'danger'
    };

    // Convert numeric availability to category
    let category;
    if (availability >= 80) {
      category = 'high';
    } else if (availability >= 50) {
      category = 'medium';
    } else {
      category = 'low';
    }

    return <Badge bg={colors[category]}>{availability}%</Badge>;
  };

  const getRoleBadge = (role) => {
    if (!role) return <Badge bg="secondary">Not Assigned</Badge>;

    const colors = {
      'project manager': 'primary',
      'developer': 'info',
      'designer': 'success',
      'tester': 'warning',
      'analyst': 'secondary'
    };

    const roleLower = role.toLowerCase();
    return <Badge bg={colors[roleLower] || 'secondary'}>{role}</Badge>;
  };

  const renderSkills = (skills) => {
    if (!skills) return null;
    
    const skillsArray = Array.isArray(skills) ? skills : 
                       typeof skills === 'string' ? JSON.parse(skills) : 
                       [];
    
    return skillsArray.map(skill => (
      <Badge key={skill} bg="secondary" className="me-1">
        {skill}
      </Badge>
    ));
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Resource Management</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/resources/allocate" variant="primary">
            <FontAwesomeIcon icon={faUserPlus} /> Allocate Resources
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
            <Tab eventKey="team" title="Team Members">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Availability</th>
                      <th>Current Projects</th>
                      <th>Skills</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map(member => (
                      <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{getRoleBadge(member.role)}</td>
                        <td>{getAvailabilityBadge(member.availability_percentage)}</td>
                        <td>
                          <ProgressBar
                            now={member.project_load}
                            label={`${member.project_load}%`}
                          />
                        </td>
                        <td>{renderSkills(member.skills)}</td>
                        <td>
                          <Button
                            as={Link}
                            to={`/resources/${member.id}`}
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
            <Tab eventKey="allocation" title="Resource Allocation">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Resource</th>
                      <th>Role</th>
                      <th>Allocation %</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourceAllocation.map(allocation => (
                      <tr key={allocation.id}>
                        <td>{allocation.project_name}</td>
                        <td>{allocation.resource_name}</td>
                        <td>{getRoleBadge(allocation.role)}</td>
                        <td>
                          <ProgressBar
                            now={allocation.allocation_percentage}
                            label={`${allocation.allocation_percentage}%`}
                          />
                        </td>
                        <td>{new Date(allocation.start_date).toLocaleDateString()}</td>
                        <td>{new Date(allocation.end_date).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={allocation.status === 'active' ? 'success' : 'secondary'}>
                            {allocation.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
            <Tab eventKey="analytics" title="Resource Analytics">
              <Row>
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <FontAwesomeIcon icon={faChartPie} /> Resource Utilization
                    </Card.Header>
                    <Card.Body>
                      {/* Add resource utilization chart here */}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <FontAwesomeIcon icon={faChartPie} /> Project Distribution
                    </Card.Header>
                    <Card.Body>
                      {/* Add project distribution chart here */}
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

export default ResourceManagementPage; 
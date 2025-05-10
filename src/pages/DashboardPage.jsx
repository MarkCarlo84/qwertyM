import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, ProgressBar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faTasks, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    budgetUtilization: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await api.get('/dashboard/stats');
        setStats(statsResponse.data);

        // Fetch recent activities
        const activitiesResponse = await api.get('/dashboard/recent-activities');
        setRecentProjects(activitiesResponse.data.filter(activity => activity.type === 'project'));

        // Fetch upcoming tasks
        const tasksResponse = await api.get('/dashboard/upcoming-tasks');
        setUpcomingTasks(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faProjectDiagram} size="2x" className="mb-2" />
              <Card.Title>Active Projects</Card.Title>
              <Card.Text>
                {stats.active_projects} / {stats.total_projects}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faTasks} size="2x" className="mb-2" />
              <Card.Title>Task Completion</Card.Title>
              <Card.Text>
                {stats.completed_tasks} / {stats.total_tasks}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faUsers} size="2x" className="mb-2" />
              <Card.Title>Team Members</Card.Title>
              <Card.Text>{stats.total_team_members}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faChartLine} size="2x" className="mb-2" />
              <Card.Title>Budget Utilization</Card.Title>
              <ProgressBar 
                now={stats.budget_utilization} 
                label={`${stats.budget_utilization}%`}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Projects and Upcoming Tasks */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Projects</h5>
              <Button as={Link} to="/projects" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map(project => (
                    <tr key={project.id}>
                      <td>
                        <Link to={`/projects/${project.id}`}>
                          {project.name}
                        </Link>
                      </td>
                      <td>{project.status}</td>
                      <td>
                        <ProgressBar 
                          now={project.progress} 
                          label={`${project.progress}%`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Tasks</h5>
              <Button as={Link} to="/tasks" variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTasks.map(task => (
                    <tr key={task.id}>
                      <td>
                        <Link to={`/tasks/${task.id}`}>
                          {task.title}
                        </Link>
                      </td>
                      <td>{task.project.name}</td>
                      <td>{new Date(task.due_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 
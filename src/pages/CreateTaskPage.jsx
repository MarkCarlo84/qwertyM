import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faCalendarAlt, faUser, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import api from "../api/axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    start_date: new Date(),
    due_date: new Date(),
    priority: 'medium',
    status: 'todo'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          api.get('/projects'),
          api.get('/users')
        ]);
        setProjects(projectsResponse.data.data || []);
        setUsers(usersResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load projects and users');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDueDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      due_date: date
    }));
  };

  const handleStartDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      start_date: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedData = {
        ...formData,
        start_date: formData.start_date.toISOString().split('T')[0],
        due_date: formData.due_date.toISOString().split('T')[0]
      };

      console.log('Sending task data:', formattedData);
      await api.post('/tasks', formattedData);
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'low': 'success',
      'medium': 'warning',
      'high': 'danger',
      'urgent': 'dark'
    };
    return <Badge bg={colors[priority]}>{priority.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status) => {
    const colors = {
      'todo': 'warning',
      'in_progress': 'info',
      'review': 'primary',
      'completed': 'success'
    };
    return <Badge bg={colors[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white py-3">
              <h3 className="mb-0 text-center">Create New Task</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <div className="mb-4">
                      <h5 className="mb-3 text-muted">Task Details</h5>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter task title"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter task description"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />
                          Project
                        </Form.Label>
                        <Form.Select
                          name="project_id"
                          value={formData.project_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a project</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="mb-4">
                      <h5 className="mb-3 text-muted">Assignment & Timeline</h5>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Assigned To
                        </Form.Label>
                        <Form.Select
                          name="assigned_to"
                          value={formData.assigned_to}
                          onChange={handleChange}
                        >
                          <option value="">Select a user</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                          Start Date
                        </Form.Label>
                        <DatePicker
                          selected={formData.start_date}
                          onChange={handleStartDateChange}
                          className="form-control"
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date()}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                          Due Date
                        </Form.Label>
                        <DatePicker
                          selected={formData.due_date}
                          onChange={handleDueDateChange}
                          className="form-control"
                          dateFormat="yyyy-MM-dd"
                          minDate={formData.start_date}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          required
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="secondary" onClick={() => navigate('/tasks')}>
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    {loading ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTaskPage; 
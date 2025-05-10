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
  Dropdown,
  Spinner,
  Alert
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faSort, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import api from "../api/axios";

const TaskListPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: '',
    assignee: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'due_date',
    direction: 'asc'
  });

  useEffect(() => {
    fetchTasks();
  }, [filters, sortConfig]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.get('/tasks', {
        params: {
          ...filters,
          sort_by: sortConfig.key,
          sort_direction: sortConfig.direction
        }
      });
      
      if (response.data && Array.isArray(response.data.data)) {
        setTasks(response.data.data);
      } else {
        setTasks([]);
        setError('No tasks found');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          navigate('/login');
          return;
        }
        setError(error.response.data.message || 'Failed to load tasks. Please try again.');
      } else if (error.request) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.response?.status === 403) {
        setError('You do not have permission to delete this task. Only the task creator, assigned user, or project manager can delete it.');
      } else {
        setError(error.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Not Started': 'warning',
      'In Progress': 'info',
      'Completed': 'success'
    };
    return <Badge bg={colors[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    };
    return <Badge bg={colors[priority]}>{priority}</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading tasks...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading tasks...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Tasks</h2>
            <Link to="/tasks/create">
              <Button variant="primary">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Create Task
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={fetchTasks}>
              Try Again
            </Button>
          </div>
        </Alert>
      )}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {tasks.length === 0 && !error ? (
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <h4 className="text-muted">No tasks found</h4>
            <p className="text-muted">Create a new task to get started</p>
            <Link to="/tasks/create">
              <Button variant="primary">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Create Task
              </Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    Title
                    <FontAwesomeIcon icon={faSort} className="ms-2" />
                  </th>
                  <th onClick={() => handleSort('project')} style={{ cursor: 'pointer' }}>
                    Project
                    <FontAwesomeIcon icon={faSort} className="ms-2" />
                  </th>
                  <th onClick={() => handleSort('assignee')} style={{ cursor: 'pointer' }}>
                    Assignee
                    <FontAwesomeIcon icon={faSort} className="ms-2" />
                  </th>
                  <th onClick={() => handleSort('end_date')} style={{ cursor: 'pointer' }}>
                    Due Date
                    <FontAwesomeIcon icon={faSort} className="ms-2" />
                  </th>
                  <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
                    Priority
                    <FontAwesomeIcon icon={faSort} className="ms-2" />
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    Status
                    <FontAwesomeIcon icon={faSort} className="ms-2" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                    </td>
                    <td>{task.project?.name}</td>
                    <td>{task.assignedUser?.name}</td>
                    <td>{new Date(task.end_date).toLocaleDateString()}</td>
                    <td>{getPriorityBadge(task.priority)}</td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/tasks/${task.id}/edit`}>
                          <Button variant="outline-primary" size="sm">Edit</Button>
                        </Link>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default TaskListPage; 
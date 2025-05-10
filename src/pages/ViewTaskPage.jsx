import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Spinner,
  Alert,
  ListGroup
} from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const ViewTaskPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [taskResponse, timeEntriesResponse] = await Promise.all([
          axios.get(`/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`/api/tasks/${id}/time-entries`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setTask(taskResponse.data);
        setTimeEntries(timeEntriesResponse.data);
      } catch (error) {
        console.error('Error fetching task data:', error);
        setError('Failed to load task data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return <Badge bg={variants[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      in_progress: 'primary',
      completed: 'success'
    };
    return <Badge bg={variants[status]}>{status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}</Badge>;
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

  if (!task) {
    return (
      <Container>
        <Alert variant="danger">Task not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Task Details</h2>
            <div>
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={() => navigate(`/tasks/${id}/edit`)}
              >
                Edit Task
              </Button>
              <Button 
                variant="outline-danger"
                onClick={handleDelete}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h3>{task.title}</h3>
              <div className="mb-3">
                <Badge bg="info" className="me-2">
                  Project: <Link to={`/projects/${task.project_id}`} className="text-white">{task.project?.name}</Link>
                </Badge>
                {getPriorityBadge(task.priority)}
                {getStatusBadge(task.status)}
              </div>
              <p className="text-muted">{task.description}</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h4 className="mb-0">Time Entries</h4>
            </Card.Header>
            <ListGroup variant="flush">
              {timeEntries.length === 0 ? (
                <ListGroup.Item>No time entries recorded</ListGroup.Item>
              ) : (
                timeEntries.map(entry => (
                  <ListGroup.Item key={entry.id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{entry.user?.name}</strong>
                        <br />
                        <small className="text-muted">
                          {format(new Date(entry.start_time), 'MMM d, yyyy h:mm a')} - 
                          {format(new Date(entry.end_time), 'h:mm a')}
                        </small>
                      </div>
                      <Badge bg="primary">{entry.duration} hours</Badge>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Task Information</h4>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Assignee:</strong>
                <br />
                {task.assignee ? (
                  <Link to={`/users/${task.assignee_id}`}>{task.assignee.name}</Link>
                ) : (
                  <span className="text-muted">Unassigned</span>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Due Date:</strong>
                <br />
                {format(new Date(task.due_date), 'MMMM d, yyyy')}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Estimated Hours:</strong>
                <br />
                {task.estimated_hours || 'Not set'}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Created:</strong>
                <br />
                {format(new Date(task.created_at), 'MMMM d, yyyy')}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Last Updated:</strong>
                <br />
                {format(new Date(task.updated_at), 'MMMM d, yyyy')}
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card>
            <Card.Header>
              <h4 className="mb-0">Actions</h4>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="primary" 
                className="w-100 mb-2"
                onClick={() => navigate(`/tasks/${id}/time-entries/new`)}
              >
                Add Time Entry
              </Button>
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => navigate(`/tasks/${id}/comments/new`)}
              >
                Add Comment
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewTaskPage; 
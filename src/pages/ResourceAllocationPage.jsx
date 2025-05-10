import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Alert } from 'react-bootstrap';
import api from '../api/axios';

const ResourceAllocationPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allocations, setAllocations] = useState([]);
    const [projects, setProjects] = useState([]);
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        resource_id: '',
        project_id: '',
        role: '',
        allocation_percentage: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch resources
            const resourcesRes = await api.get('/resources');
            console.log('Resources response:', resourcesRes.data);
            setResources(resourcesRes.data || []);

            // Fetch projects
            const projectsRes = await api.get('/projects');
            console.log('Projects response:', projectsRes.data);
            setProjects(projectsRes.data?.data || []);

            // Fetch allocations
            const allocationsRes = await api.get('/resources/allocation');
            console.log('Allocations response:', allocationsRes.data);
            setAllocations(allocationsRes.data || []);
        } catch (err) {
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            
            console.log('Submitting form data:', formData);
            const response = await api.post('/resources/allocate', formData);
            console.log('Allocation response:', response.data);
            
            await fetchData();
            
            // Reset form
            setFormData({
                resource_id: '',
                project_id: '',
                role: '',
                allocation_percentage: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        } catch (err) {
            console.error('Error creating allocation:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data?.message || 'Failed to create allocation');
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
            <h2 className="mb-4">Resource Allocation</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Card className="mb-4">
                <Card.Header>Create New Allocation</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Resource</Form.Label>
                                    <Form.Select
                                        name="resource_id"
                                        value={formData.resource_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Resource</option>
                                        {Array.isArray(resources) && resources.map(resource => (
                                            <option key={resource.id} value={resource.id}>
                                                {resource.user?.name} ({resource.role})
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {!Array.isArray(resources) && (
                                        <Form.Text className="text-danger">
                                            No resources available
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project</Form.Label>
                                    <Form.Select
                                        name="project_id"
                                        value={formData.project_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Project</option>
                                        {Array.isArray(projects) && projects.map(project => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {!Array.isArray(projects) && (
                                        <Form.Text className="text-danger">
                                            No projects available
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Allocation Percentage</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="allocation_percentage"
                                        value={formData.allocation_percentage}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="100"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Allocation'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>Current Allocations</Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
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
                            {Array.isArray(allocations) && allocations.map(allocation => (
                                <tr key={allocation.id}>
                                    <td>{allocation.project_name}</td>
                                    <td>{allocation.resource_name}</td>
                                    <td>{allocation.role}</td>
                                    <td>{allocation.allocation_percentage}%</td>
                                    <td>{new Date(allocation.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(allocation.end_date).toLocaleDateString()}</td>
                                    <td>{allocation.status}</td>
                                </tr>
                            ))}
                            {(!Array.isArray(allocations) || allocations.length === 0) && (
                                <tr>
                                    <td colSpan="7" className="text-center">No current allocations</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ResourceAllocationPage; 
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResourceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resource, setResource] = useState(null);
    const [allocations, setAllocations] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [resourceRes, allocationsRes] = await Promise.all([
                api.get(`/resources/${id}`),
                api.get(`/resources/allocation?resource_id=${id}`)
            ]);

            setResource(resourceRes.data);
            setAllocations(allocationsRes.data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            if (err.response?.status === 404) {
                setError('Resource not found. Please check the ID and try again.');
            } else {
                setError(err.response?.data?.message || 'Failed to fetch resource data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const getAvailabilityBadge = (availability) => {
        const colors = {
            'high': 'success',
            'medium': 'warning',
            'low': 'danger'
        };
        return <Badge bg={colors[availability]}>{availability}</Badge>;
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <Alert variant="info">Loading...</Alert>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
                <Button variant="primary" onClick={() => navigate('/resources')}>
                    Back to Resources
                </Button>
            </Container>
        );
    }

    if (!resource) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">Resource not found</Alert>
                <Button variant="primary" onClick={() => navigate('/resources')}>
                    Back to Resources
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>Resource Details</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={() => navigate('/resources')}>
                        Back to Resources
                    </Button>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Header>Resource Information</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h5>Basic Information</h5>
                            <Table>
                                <tbody>
                                    <tr>
                                        <th>Name:</th>
                                        <td>{resource.user?.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Email:</th>
                                        <td>{resource.user?.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Role:</th>
                                        <td>{resource.role}</td>
                                    </tr>
                                    <tr>
                                        <th>Availability:</th>
                                        <td>{getAvailabilityBadge(resource.availability)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h5>Skills</h5>
                            <div>
                                {Array.isArray(resource.skills) && resource.skills.map((skill, index) => (
                                    <Badge key={index} bg="info" className="me-2 mb-2">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>Current Allocations</Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Project</th>
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
                                    <td>{allocation.role}</td>
                                    <td>{allocation.allocation_percentage}%</td>
                                    <td>{new Date(allocation.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(allocation.end_date).toLocaleDateString()}</td>
                                    <td>{allocation.status}</td>
                                </tr>
                            ))}
                            {(!Array.isArray(allocations) || allocations.length === 0) && (
                                <tr>
                                    <td colSpan="6" className="text-center">No current allocations</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ResourceDetailsPage; 
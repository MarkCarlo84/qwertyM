import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, ProgressBar } from 'react-bootstrap';

const BudgetTracking = ({ projectId }) => {
    const [budget, setBudget] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [estimatedBudget, setEstimatedBudget] = useState('');
    const [actualBudget, setActualBudget] = useState('');

    useEffect(() => {
        fetchBudget();
    }, [projectId]);

    const fetchBudget = async () => {
        try {
            const response = await axios.get(`/api/projects/${projectId}/budget`);
            setBudget(response.data);
            setEstimatedBudget(response.data.estimated_budget);
            setActualBudget(response.data.actual_budget);
        } catch (error) {
            console.error('Error fetching budget:', error);
        }
    };

    const handleUpdateBudget = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/projects/${projectId}/budget`, {
                estimated_budget: estimatedBudget,
                actual_budget: actualBudget
            });
            fetchBudget();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };

    const calculateRemainingBudget = () => {
        if (!budget) return 0;
        return budget.estimated_budget - budget.actual_budget;
    };

    const calculateBudgetUtilization = () => {
        if (!budget || budget.estimated_budget === 0) return 0;
        return (budget.actual_budget / budget.estimated_budget) * 100;
    };

    if (!budget) return <div>Loading...</div>;

    return (
        <div className="budget-tracking">
            <h2 className="mb-4">Budget Tracking</h2>
            
            <div className="row">
                <div className="col-md-4">
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Estimated Budget</Card.Title>
                            <Card.Text className="h3">${budget.estimated_budget.toFixed(2)}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                
                <div className="col-md-4">
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Actual Budget</Card.Title>
                            <Card.Text className="h3">${budget.actual_budget.toFixed(2)}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                
                <div className="col-md-4">
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Remaining Budget</Card.Title>
                            <Card.Text className="h3">${calculateRemainingBudget().toFixed(2)}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Budget Utilization</Card.Title>
                    <ProgressBar
                        now={calculateBudgetUtilization()}
                        label={`${calculateBudgetUtilization().toFixed(1)}%`}
                        variant={calculateBudgetUtilization() > 100 ? 'danger' : 'success'}
                    />
                </Card.Body>
            </Card>

            <Button variant="primary" onClick={() => setShowEditModal(true)}>
                Update Budget
            </Button>

            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Budget</h5>
                                <Button
                                    variant="close"
                                    onClick={() => setShowEditModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <Form onSubmit={handleUpdateBudget}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Estimated Budget</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={estimatedBudget}
                                            onChange={(e) => setEstimatedBudget(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Actual Budget</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={actualBudget}
                                            onChange={(e) => setActualBudget(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Update
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetTracking; 
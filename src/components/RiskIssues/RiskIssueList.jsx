import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './RiskIssueList.css';

const RiskIssueList = ({ projectId }) => {
    const [risksIssues, setRisksIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchRisksIssues();
    }, [projectId, filters]);

    const fetchRisksIssues = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/risks-issues', {
                params: {
                    project_id: projectId,
                    ...filters,
                },
            });
            setRisksIssues(response.data.data);
            setError(null);
        } catch (error) {
            setError('Error fetching risks and issues');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`/api/risks-issues/${id}`, { status: newStatus });
            fetchRisksIssues();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await axios.delete(`/api/risks-issues/${id}`);
            fetchRisksIssues();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="risks-issues-list">
            <div className="filters">
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="risk">Risks</option>
                    <option value="issue">Issues</option>
                </select>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className="items">
                {risksIssues.map((item) => (
                    <div key={item.id} className={`item ${item.type}`}>
                        <div className="item-header">
                            <h3>{item.title}</h3>
                            <span className={`severity ${item.severity}`}>
                                {item.severity}
                            </span>
                        </div>
                        <p className="description">{item.description}</p>
                        <div className="item-footer">
                            <div className="meta">
                                <span>Created by: {item.user.name}</span>
                                {item.assigned_to && (
                                    <span>Assigned to: {item.assignedUser.name}</span>
                                )}
                                {item.due_date && (
                                    <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                                )}
                            </div>
                            <div className="actions">
                                <select
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                                {user.id === item.user_id && (
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RiskIssueList; 
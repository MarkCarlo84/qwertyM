import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';

const TimeTracking = ({ taskId }) => {
    const [timeEntries, setTimeEntries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [currentEntry, setCurrentEntry] = useState(null);

    useEffect(() => {
        fetchTimeEntries();
    }, [taskId]);

    const fetchTimeEntries = async () => {
        try {
            const response = await axios.get(`/api/tasks/${taskId}/time-entries`);
            setTimeEntries(response.data);
        } catch (error) {
            console.error('Error fetching time entries:', error);
        }
    };

    const handleStartTracking = async () => {
        try {
            const response = await axios.post(`/api/tasks/${taskId}/time-entries`, {
                start_time: new Date().toISOString(),
                description: 'Started time tracking'
            });
            setCurrentEntry(response.data);
            setIsTracking(true);
        } catch (error) {
            console.error('Error starting time tracking:', error);
        }
    };

    const handleStopTracking = async () => {
        try {
            await axios.put(`/api/tasks/${taskId}/time-entries/${currentEntry.id}`, {
                end_time: new Date().toISOString()
            });
            setIsTracking(false);
            setCurrentEntry(null);
            fetchTimeEntries();
        } catch (error) {
            console.error('Error stopping time tracking:', error);
        }
    };

    const handleAddEntry = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/tasks/${taskId}/time-entries`, {
                start_time: startTime,
                end_time: endTime,
                description
            });
            fetchTimeEntries();
            setShowModal(false);
            setStartTime('');
            setEndTime('');
            setDescription('');
        } catch (error) {
            console.error('Error adding time entry:', error);
        }
    };

    const formatDuration = (start, end) => {
        if (!start || !end) return '0 minutes';
        const duration = new Date(end) - new Date(start);
        const minutes = Math.floor(duration / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    return (
        <div className="time-tracking">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Time Tracking</h2>
                <div>
                    {!isTracking ? (
                        <Button variant="success" onClick={handleStartTracking}>
                            Start Tracking
                        </Button>
                    ) : (
                        <Button variant="danger" onClick={handleStopTracking}>
                            Stop Tracking
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        className="ms-2"
                        onClick={() => setShowModal(true)}
                    >
                        Add Entry
                    </Button>
                </div>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {timeEntries.map(entry => (
                        <tr key={entry.id}>
                            <td>{new Date(entry.start_time).toLocaleString()}</td>
                            <td>
                                {entry.end_time
                                    ? new Date(entry.end_time).toLocaleString()
                                    : 'In Progress'}
                            </td>
                            <td>{formatDuration(entry.start_time, entry.end_time)}</td>
                            <td>{entry.description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Time Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddEntry}>
                        <Form.Group className="mb-3">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Entry
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TimeTracking; 
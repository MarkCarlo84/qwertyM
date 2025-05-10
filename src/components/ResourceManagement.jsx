import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';

const ResourceManagement = ({ projectId }) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        fetchTeamMembers();
        fetchUsers();
    }, [projectId]);

    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get(`/api/projects/${projectId}/team-members`);
            setTeamMembers(response.data);
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/projects/${projectId}/team-members`, {
                user_id: selectedUser,
                role: selectedRole
            });
            fetchTeamMembers();
            setShowModal(false);
            setSelectedUser('');
            setSelectedRole('');
        } catch (error) {
            console.error('Error adding team member:', error);
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            await axios.delete(`/api/projects/${projectId}/team-members/${memberId}`);
            fetchTeamMembers();
        } catch (error) {
            console.error('Error removing team member:', error);
        }
    };

    return (
        <div className="resource-management">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Resource Management</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Add Team Member
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teamMembers.map(member => (
                        <tr key={member.id}>
                            <td>{member.user.name}</td>
                            <td>{member.role}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRemoveMember(member.id)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Team Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddMember}>
                        <Form.Group className="mb-3">
                            <Form.Label>Select User</Form.Label>
                            <Form.Select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                required
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
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                required
                            >
                                <option value="">Select a role</option>
                                <option value="developer">Developer</option>
                                <option value="designer">Designer</option>
                                <option value="manager">Manager</option>
                                <option value="tester">Tester</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Member
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ResourceManagement; 
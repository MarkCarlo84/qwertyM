import { useState, useEffect } from 'react';
import axios from 'axios';
import Styles from '../css modules/TeamMemberAssignment.module.css';

export default function TeamMemberAssignment({ projectId }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole] = useState('member');

  useEffect(() => {
    fetchTeamMembers();
    fetchAvailableUsers();
  }, [projectId]);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/projects/${projectId}/team-members`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`,
            'Accept': 'application/json'
          }
        }
      );
      setTeamMembers(response.data);
    } catch (err) {
      setError('Failed to fetch team members');
      console.error('Error fetching team members:', err);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`,
          'Accept': 'application/json'
        }
      });
      setAvailableUsers(response.data);
    } catch (err) {
      setError('Failed to fetch available users');
      console.error('Error fetching users:', err);
    }
  };

  const handleAssignMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/projects/${projectId}/team-members`,
        {
          user_id: selectedUser,
          role: role
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Team member assigned successfully!');
      setSelectedUser('');
      setRole('member');
      fetchTeamMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign team member');
      console.error('Error assigning team member:', err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/projects/${projectId}/team-members/${memberId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`,
            'Accept': 'application/json'
          }
        }
      );

      setSuccess('Team member removed successfully!');
      fetchTeamMembers();
    } catch (err) {
      setError('Failed to remove team member');
      console.error('Error removing team member:', err);
    }
  };

  return (
    <div className={Styles.container}>
      <h2>Team Members</h2>
      
      {error && <div className={Styles.error}>{error}</div>}
      {success && <div className={Styles.success}>{success}</div>}

      <form onSubmit={handleAssignMember} className={Styles.form}>
        <div className={Styles.formGroup}>
          <label htmlFor="user">Select User:</label>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Select a user</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="member">Team Member</option>
            <option value="lead">Team Lead</option>
            <option value="manager">Project Manager</option>
          </select>
        </div>

        <button type="submit" className={Styles.submitButton}>
          Assign Member
        </button>
      </form>

      <div className={Styles.membersList}>
        <h3>Current Team Members</h3>
        {teamMembers.length > 0 ? (
          <ul>
            {teamMembers.map(member => (
              <li key={member.id} className={Styles.memberItem}>
                <span>{member.user.name} - {member.role}</span>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className={Styles.removeButton}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No team members assigned yet.</p>
        )}
      </div>
    </div>
  );
} 
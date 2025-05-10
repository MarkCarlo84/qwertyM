import { useState, useEffect } from 'react';
import axios from 'axios';
import Buttons from './Button.jsx';
import Styles from '../css modules/CreateTaskForm.module.css';

export default function CreateTaskForm({ projectId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    start_date: '',
    end_date: '',
    assigned_to: ''
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!projectId) {
        setError('Project ID is required to fetch team members');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('authorization-token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/projects/${projectId}/team-members`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setTeamMembers(response.data);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Error loading team members. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authorization-token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/projects/${projectId}/tasks`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Task created successfully!');
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        start_date: '',
        end_date: '',
        assigned_to: ''
      });

      // Refresh the page to show the new task
      window.location.reload();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Error creating task. Please try again.');
    }
  };

  return (
    <div className={Styles.formContainer}>
      {error && <div className={Styles.error}>{error}</div>}
      {success && <div className={Styles.success}>{success}</div>}
      
      <form onSubmit={handleSubmit} className={Styles.form}>
        <div className={Styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="assigned_to">Assign To:</label>
          <select
            id="assigned_to"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="">Select Team Member</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.user?.name || 'Unknown Member'}
              </option>
            ))}
          </select>
          {isLoading && <div className={Styles.loading}>Loading team members...</div>}
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="end_date">End Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>

        <Buttons 
          name="Create Task" 
          type="submit" 
          className={Styles.submitButton}
        />
      </form>
    </div>
  );
}

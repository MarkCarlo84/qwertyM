import { useState, useEffect } from 'react';
import axios from 'axios';
import Styles from '../css modules/TimeTracker.module.css';

export default function TimeTracker({ taskId }) {
  const [timeEntries, setTimeEntries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    hours: '',
    minutes: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTimeEntries();
  }, [taskId]);

  const fetchTimeEntries = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/tasks/${taskId}/time-entries`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`,
            'Accept': 'application/json'
          }
        }
      );
      setTimeEntries(response.data);
    } catch (err) {
      setError('Failed to fetch time entries');
      console.error('Error fetching time entries:', err);
    }
  };

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

    const totalMinutes = (parseInt(formData.hours) * 60) + parseInt(formData.minutes);

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/tasks/${taskId}/time-entries`,
        {
          duration: totalMinutes,
          description: formData.description,
          date: formData.date
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Time entry added successfully!');
      setFormData({
        hours: '',
        minutes: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchTimeEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add time entry');
      console.error('Error adding time entry:', err);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const calculateTotalTime = () => {
    return timeEntries.reduce((total, entry) => total + entry.duration, 0);
  };

  return (
    <div className={Styles.container}>
      <h2>Time Tracker</h2>
      
      {error && <div className={Styles.error}>{error}</div>}
      {success && <div className={Styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} className={Styles.form}>
        <div className={Styles.formRow}>
          <div className={Styles.formGroup}>
            <label htmlFor="hours">Hours:</label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              min="0"
              placeholder="0"
              required
            />
          </div>

          <div className={Styles.formGroup}>
            <label htmlFor="minutes">Minutes:</label>
            <input
              type="number"
              id="minutes"
              name="minutes"
              value={formData.minutes}
              onChange={handleChange}
              min="0"
              max="59"
              placeholder="0"
              required
            />
          </div>

          <div className={Styles.formGroup}>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you work on?"
            required
          />
        </div>

        <button type="submit" className={Styles.submitButton}>
          Add Time Entry
        </button>
      </form>

      <div className={Styles.timeEntries}>
        <div className={Styles.header}>
          <h3>Time Entries</h3>
          <div className={Styles.totalTime}>
            Total Time: {formatDuration(calculateTotalTime())}
          </div>
        </div>

        {timeEntries.length > 0 ? (
          <div className={Styles.entriesList}>
            {timeEntries.map(entry => (
              <div key={entry.id} className={Styles.entryItem}>
                <div className={Styles.entryHeader}>
                  <span className={Styles.date}>
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span className={Styles.duration}>
                    {formatDuration(entry.duration)}
                  </span>
                </div>
                <p className={Styles.description}>{entry.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={Styles.noEntries}>No time entries yet.</p>
        )}
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import axios from 'axios';
import Styles from '../css modules/ProjectProgress.module.css';

export default function ProjectProgress({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(new Date().setMonth(new Date().getMonth() + 1))
  });

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/projects/${projectId}/tasks`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authorization-token')}`,
            'Accept': 'application/json'
          }
        }
      );
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    }
  };

  const calculateProgress = (task) => {
    if (!task.start_date || !task.end_date) return 0;
    
    const start = new Date(task.start_date);
    const end = new Date(task.end_date);
    const today = new Date();
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const total = end - start;
    const current = today - start;
    return Math.round((current / total) * 100);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#22c55e';
      case 'in_progress':
        return '#4a90e2';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateBarPosition = (task) => {
    if (!task.start_date || !task.end_date) return { left: 0, width: 0 };
    
    const start = new Date(task.start_date);
    const end = new Date(task.end_date);
    const totalDays = (dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24);
    const daysFromStart = (start - dateRange.start) / (1000 * 60 * 60 * 24);
    const taskDuration = (end - start) / (1000 * 60 * 60 * 24);
    
    return {
      left: `${(daysFromStart / totalDays) * 100}%`,
      width: `${(taskDuration / totalDays) * 100}%`
    };
  };

  return (
    <div className={Styles.container}>
      <h2>Project Progress</h2>
      
      {error && <div className={Styles.error}>{error}</div>}

      <div className={Styles.ganttChart}>
        <div className={Styles.header}>
          <div className={Styles.taskColumn}>Task</div>
          <div className={Styles.timelineColumn}>
            <div className={Styles.dateRange}>
              {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
            </div>
          </div>
        </div>

        <div className={Styles.tasks}>
          {tasks.map(task => (
            <div key={task.id} className={Styles.taskRow}>
              <div className={Styles.taskInfo}>
                <div className={Styles.taskName}>{task.title}</div>
                <div className={Styles.taskMeta}>
                  <span className={Styles.status} style={{ backgroundColor: getStatusColor(task.status) }}>
                    {task.status}
                  </span>
                  <span className={Styles.priority}>Priority: {task.priority}</span>
                </div>
              </div>
              
              <div className={Styles.timeline}>
                <div 
                  className={Styles.taskBar}
                  style={{
                    ...calculateBarPosition(task),
                    backgroundColor: getStatusColor(task.status)
                  }}
                >
                  <div className={Styles.progressBar}>
                    <div 
                      className={Styles.progressFill}
                      style={{ width: `${calculateProgress(task)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={Styles.legend}>
        <div className={Styles.legendItem}>
          <span className={Styles.legendColor} style={{ backgroundColor: '#22c55e' }}></span>
          <span>Completed</span>
        </div>
        <div className={Styles.legendItem}>
          <span className={Styles.legendColor} style={{ backgroundColor: '#4a90e2' }}></span>
          <span>In Progress</span>
        </div>
        <div className={Styles.legendItem}>
          <span className={Styles.legendColor} style={{ backgroundColor: '#f59e0b' }}></span>
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
} 
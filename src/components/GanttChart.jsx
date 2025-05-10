import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const GanttChart = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [viewMode, setViewMode] = useState(ViewMode.Week);

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/projects/${projectId}/tasks`);
            const ganttTasks = response.data.map(task => ({
                id: task.id,
                name: task.title,
                start: new Date(task.start_date),
                end: new Date(task.end_date),
                progress: calculateProgress(task),
                type: 'task',
                hideChildren: false,
                styles: { progressColor: getStatusColor(task.status) }
            }));
            setTasks(ganttTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const calculateProgress = (task) => {
        switch (task.status) {
            case 'Not Started':
                return 0;
            case 'In Progress':
                return 50;
            case 'Completed':
                return 100;
            default:
                return 0;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Not Started':
                return '#ff4d4f';
            case 'In Progress':
                return '#faad14';
            case 'Completed':
                return '#52c41a';
            default:
                return '#1890ff';
        }
    };

    const handleTaskChange = (task) => {
        const updatedTasks = tasks.map(t => {
            if (t.id === task.id) {
                return task;
            }
            return t;
        });
        setTasks(updatedTasks);
    };

    const handleProgressChange = async (task) => {
        try {
            await axios.put(`/api/tasks/${task.id}`, {
                status: task.progress === 100 ? 'Completed' : 'In Progress'
            });
            handleTaskChange(task);
        } catch (error) {
            console.error('Error updating task progress:', error);
        }
    };

    return (
        <Card className="gantt-chart">
            <Card.Body>
                <Card.Title className="mb-4">Project Timeline</Card.Title>
                <div style={{ height: '500px' }}>
                    <Gantt
                        tasks={tasks}
                        viewMode={viewMode}
                        onDateChange={handleTaskChange}
                        onProgressChange={handleProgressChange}
                        onExpanderClick={handleTaskChange}
                        listCellWidth=""
                        columnWidth={65}
                        ganttHeight={400}
                        todayColor="#f0f0f0"
                        barCornerRadius={4}
                        barProgressColor="#1890ff"
                        barBackgroundColor="#e6f7ff"
                        projectProgressColor="#1890ff"
                        projectBackgroundColor="#e6f7ff"
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default GanttChart; 
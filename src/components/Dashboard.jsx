import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Typography, Progress, Table } from 'antd';
import { 
    ProjectOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    DollarOutlined,
    WarningOutlined,
    TeamOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, activitiesRes, tasksRes, projectsRes] = await Promise.all([
                axios.get('/api/dashboard/stats'),
                axios.get('/api/dashboard/recent-activities'),
                axios.get('/api/dashboard/upcoming-tasks'),
                axios.get('/api/dashboard/project-overview')
            ]);

            setStats(statsRes.data);
            setActivities(activitiesRes.data);
            setUpcomingTasks(tasksRes.data);
            setProjects(projectsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const activityColumns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const icons = {
                    task: <CheckCircleOutlined style={{ color: '#1890ff' }} />,
                    time_entry: <ClockCircleOutlined style={{ color: '#52c41a' }} />,
                    expense: <DollarOutlined style={{ color: '#faad14' }} />
                };
                return icons[type] || type;
            }
        },
        {
            title: 'Description',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => {
                switch (record.type) {
                    case 'task':
                        return `${text} (${record.project})`;
                    case 'time_entry':
                        return `${record.user} logged ${record.duration} minutes on ${record.task || record.project}`;
                    case 'expense':
                        return `${text} - $${record.amount} (${record.project})`;
                    default:
                        return text;
                }
            }
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString()
        }
    ];

    const projectColumns = [
        {
            title: 'Project',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Text style={{ 
                    color: status === 'completed' ? '#52c41a' : 
                           status === 'in_progress' ? '#1890ff' : 
                           status === 'on_hold' ? '#faad14' : '#ff4d4f'
                }}>
                    {status.replace('_', ' ').toUpperCase()}
                </Text>
            )
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress) => <Progress percent={progress} size="small" />
        },
        {
            title: 'Team',
            dataIndex: 'team_size',
            key: 'team_size',
            render: (size) => <TeamOutlined /> {size}
        },
        {
            title: 'Tasks',
            dataIndex: 'tasks_count',
            key: 'tasks_count'
        },
        {
            title: 'Risks',
            dataIndex: 'risks_count',
            key: 'risks_count',
            render: (count) => (
                <Text style={{ color: count > 0 ? '#ff4d4f' : '#52c41a' }}>
                    <WarningOutlined /> {count}
                </Text>
            )
        }
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Dashboard</Title>
            
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Projects"
                            value={stats?.total_projects}
                            prefix={<ProjectOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Projects"
                            value={stats?.active_projects}
                            prefix={<ProjectOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Completed Tasks"
                            value={stats?.completed_tasks}
                            suffix={`/ ${stats?.total_tasks}`}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Time Spent"
                            value={stats?.total_time_spent}
                            suffix="hours"
                            prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Activities and Upcoming Tasks */}
            <Row gutter={16}>
                <Col span={16}>
                    <Card title="Recent Activities" style={{ marginBottom: '24px' }}>
                        <Table
                            dataSource={activities}
                            columns={activityColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>

                    <Card title="Project Overview">
                        <Table
                            dataSource={projects}
                            columns={projectColumns}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Upcoming Tasks">
                        <List
                            dataSource={upcomingTasks}
                            renderItem={task => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={task.title}
                                        description={
                                            <>
                                                <div>Project: {task.project.name}</div>
                                                <div>Due: {new Date(task.due_date).toLocaleDateString()}</div>
                                                <div>Assigned to: {task.assignedUser.name}</div>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard; 
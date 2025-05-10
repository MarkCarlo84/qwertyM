import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Table,
    Button,
    Card,
    Badge,
    Progress,
    Dropdown,
    Menu,
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    message,
    Space,
    Tag
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const TaskList = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingTask, setEditingTask] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/projects/${projectId}/tasks`);
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch tasks');
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            message.error('Failed to fetch users');
        }
    };

    const handleCreateTask = async (values) => {
        try {
            await axios.post(`/api/projects/${projectId}/tasks`, values);
            message.success('Task created successfully');
            setModalVisible(false);
            form.resetFields();
            fetchTasks();
        } catch (error) {
            message.error('Failed to create task');
        }
    };

    const handleEditTask = async (values) => {
        try {
            await axios.put(`/api/tasks/${editingTask.id}`, values);
            message.success('Task updated successfully');
            setModalVisible(false);
            form.resetFields();
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            message.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`/api/tasks/${id}`);
            message.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            message.error('Failed to delete task');
        }
    };

    const handleStatusChange = async (taskId, status) => {
        try {
            await axios.put(`/api/tasks/${taskId}`, { status });
            message.success('Task status updated successfully');
            fetchTasks();
        } catch (error) {
            message.error('Failed to update task status');
        }
    };

    const showModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            form.setFieldsValue({
                ...task,
                start_date: task.start_date ? moment(task.start_date) : null,
                due_date: task.due_date ? moment(task.due_date) : null
            });
        } else {
            setEditingTask(null);
            form.resetFields();
        }
        setModalVisible(true);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space>
                    {record.parent_task_id && <Tag color="blue">Subtask</Tag>}
                    {text}
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusColors = {
                    todo: 'default',
                    in_progress: 'processing',
                    review: 'warning',
                    completed: 'success',
                    cancelled: 'error'
                };
                return (
                    <Badge color={statusColors[status]} text={status.replace('_', ' ')} />
                );
            }
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress) => (
                <Progress percent={progress} size="small" />
            )
        },
        {
            title: 'Assigned To',
            dataIndex: 'assigned_to',
            key: 'assigned_to',
            render: (userId) => {
                const user = users.find(u => u.id === userId);
                return user ? (
                    <Space>
                        <UserOutlined />
                        {user.name}
                    </Space>
                ) : 'Unassigned';
            }
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (date) => moment(date).format('MMM DD, YYYY')
        },
        {
            title: 'Time Spent',
            key: 'time_spent',
            render: (_, record) => (
                <Space>
                    <ClockCircleOutlined />
                    {record.actual_hours || 0}h
                </Space>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="edit" onClick={() => showModal(record)}>
                                    <EditOutlined /> Edit
                                </Menu.Item>
                                <Menu.Item key="delete" onClick={() => handleDeleteTask(record.id)}>
                                    <DeleteOutlined /> Delete
                                </Menu.Item>
                                {record.status !== 'completed' && (
                                    <Menu.Item key="complete" onClick={() => handleStatusChange(record.id, 'completed')}>
                                        <CheckCircleOutlined /> Mark Complete
                                    </Menu.Item>
                                )}
                                {record.status !== 'cancelled' && (
                                    <Menu.Item key="cancel" onClick={() => handleStatusChange(record.id, 'cancelled')}>
                                        <CloseCircleOutlined /> Cancel
                                    </Menu.Item>
                                )}
                            </Menu>
                        }
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            )
        }
    ];

    return (
        <div className="task-list">
            <Card
                title="Tasks"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        New Task
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={tasks}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingTask ? 'Edit Task' : 'New Task'}
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setEditingTask(null);
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={editingTask ? handleEditTask : handleCreateTask}
                >
                    <Form.Item
                        name="title"
                        label="Task Title"
                        rules={[{ required: true, message: 'Please enter task title' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter task description' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="assigned_to"
                        label="Assign To"
                        rules={[{ required: true, message: 'Please select assignee' }]}
                    >
                        <Select>
                            {users.map(user => (
                                <Option key={user.id} value={user.id}>{user.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="start_date"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="due_date"
                        label="Due Date"
                        rules={[{ required: true, message: 'Please select due date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="estimated_hours"
                        label="Estimated Hours"
                        rules={[{ required: true, message: 'Please enter estimated hours' }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>

                    <Form.Item
                        name="priority"
                        label="Priority"
                        rules={[{ required: true, message: 'Please select priority' }]}
                    >
                        <Select>
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                            <Option value="urgent">Urgent</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingTask ? 'Update Task' : 'Create Task'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TaskList;

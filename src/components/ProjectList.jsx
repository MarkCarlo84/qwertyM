import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    message
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    TeamOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    WarningOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data.data);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch projects');
            setLoading(false);
        }
    };

    const handleCreateProject = async (values) => {
        try {
            await axios.post('/api/projects', values);
            message.success('Project created successfully');
            setModalVisible(false);
            form.resetFields();
            fetchProjects();
        } catch (error) {
            message.error('Failed to create project');
        }
    };

    const handleEditProject = async (values) => {
        try {
            await axios.put(`/api/projects/${editingProject.id}`, values);
            message.success('Project updated successfully');
            setModalVisible(false);
            form.resetFields();
            setEditingProject(null);
            fetchProjects();
        } catch (error) {
            message.error('Failed to update project');
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`/api/projects/${id}`);
            message.success('Project deleted successfully');
            fetchProjects();
        } catch (error) {
            message.error('Failed to delete project');
        }
    };

    const showModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            form.setFieldsValue({
                ...project,
                start_date: project.start_date ? moment(project.start_date) : null,
                end_date: project.end_date ? moment(project.end_date) : null
            });
        } else {
            setEditingProject(null);
            form.resetFields();
        }
        setModalVisible(true);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link to={`/projects/${record.id}`}>{text}</Link>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusColors = {
                    planning: 'blue',
                    in_progress: 'green',
                    on_hold: 'orange',
                    completed: 'purple',
                    cancelled: 'red'
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
            title: 'Team',
            key: 'team',
            render: (_, record) => (
                <span>
                    <TeamOutlined /> {record.team_members_count}
                </span>
            )
        },
        {
            title: 'Tasks',
            key: 'tasks',
            render: (_, record) => (
                <span>
                    <FileTextOutlined /> {record.tasks_count}
                </span>
            )
        },
        {
            title: 'Time',
            key: 'time',
            render: (_, record) => (
                <span>
                    <ClockCircleOutlined /> {record.total_time_spent}h
                </span>
            )
        },
        {
            title: 'Budget',
            key: 'budget',
            render: (_, record) => (
                <span>
                    <DollarOutlined /> {record.budget}
                </span>
            )
        },
        {
            title: 'Risks',
            key: 'risks',
            render: (_, record) => (
                <span>
                    <WarningOutlined /> {record.risks_count}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="edit" onClick={() => showModal(record)}>
                                <EditOutlined /> Edit
                            </Menu.Item>
                            <Menu.Item key="delete" onClick={() => handleDeleteProject(record.id)}>
                                <DeleteOutlined /> Delete
                            </Menu.Item>
                        </Menu>
                    }
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            )
        }
    ];

    return (
        <div className="project-list">
            <Card
                title="Projects"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        New Project
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={projects}
                    loading={loading}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingProject ? 'Edit Project' : 'New Project'}
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setEditingProject(null);
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={editingProject ? handleEditProject : handleCreateProject}
                >
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please enter project name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter project description' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="start_date"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="end_date"
                        label="End Date"
                        rules={[{ required: true, message: 'Please select end date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="budget"
                        label="Budget"
                        rules={[{ required: true, message: 'Please enter project budget' }]}
                    >
                        <Input type="number" prefix="$" />
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
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="risk_level"
                        label="Risk Level"
                        rules={[{ required: true, message: 'Please select risk level' }]}
                    >
                        <Select>
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingProject ? 'Update Project' : 'Create Project'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectList;

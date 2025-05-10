import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import ResourceManagement from './ResourceManagement';
import BudgetTracking from './BudgetTracking';
import TimeTracking from './TimeTracking';
import GanttChart from './GanttChart';
import CreateTaskForm from './CreateTaskForm';
import TaskList from './TaskList';

const ProjectDashboard = ({ projectId }) => {
    const [activeTab, setActiveTab] = useState('tasks');

    return (
        <Container fluid className="project-dashboard py-4">
            <h1 className="mb-4">Project Dashboard</h1>
            
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
            >
                <Tab eventKey="tasks" title="Tasks">
                    <Row>
                        <Col md={4}>
                            <CreateTaskForm projectId={projectId} />
                        </Col>
                        <Col md={8}>
                            <TaskList projectId={projectId} />
                        </Col>
                    </Row>
                </Tab>
                
                <Tab eventKey="timeline" title="Timeline">
                    <GanttChart projectId={projectId} />
                </Tab>
                
                <Tab eventKey="resources" title="Resources">
                    <ResourceManagement projectId={projectId} />
                </Tab>
                
                <Tab eventKey="budget" title="Budget">
                    <BudgetTracking projectId={projectId} />
                </Tab>
                
                <Tab eventKey="time" title="Time Tracking">
                    <TimeTracking projectId={projectId} />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default ProjectDashboard; 
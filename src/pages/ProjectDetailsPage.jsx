import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Buttons from "../components/Button.jsx";
import Styles from "../css modules/ProjectDetailsPage.module.css";
import AuthTest from "../components/AuthTest";
import CreateTaskForm from "../components/CreateTaskForm";
import TeamMemberAssignment from "../components/TeamMemberAssignment";
import BudgetTracker from "../components/BudgetTracker";
import TimeTracker from "../components/TimeTracker";
import ProjectProgress from "../components/ProjectProgress";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data.data);
      } catch (error) {
        console.error("Error fetching project:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      }
    };

    fetchProject();
  }, [projectId]);

  function handleBack() {
    navigate("/ViewProjectPage");
  }

  if (!project) return <div>Loading...</div>;

  return (
    <section className={Styles.container}>
      <AuthTest />
      
      <h1 className={Styles.title}>Project Details</h1>

      {/* Project Info */}
      <div className={Styles.projectInfo}>
        <div className={Styles.infoGroup}>
          <label className={Styles.label}>Project Name:</label>
          <p className={Styles.text}>{project.name}</p>
        </div>

        <div className={Styles.infoGroup}>
          <label className={Styles.label}>Description:</label>
          <p className={Styles.text}>{project.description}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={Styles.tabs}>
        <button 
          className={`${Styles.tab} ${activeTab === 'tasks' ? Styles.activeTab : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={`${Styles.tab} ${activeTab === 'team' ? Styles.activeTab : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team
        </button>
        <button 
          className={`${Styles.tab} ${activeTab === 'budget' ? Styles.activeTab : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget
        </button>
        <button 
          className={`${Styles.tab} ${activeTab === 'progress' ? Styles.activeTab : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </button>
      </div>

      {/* Tab Content */}
      <div className={Styles.tabContent}>
        {activeTab === 'tasks' && (
          <>
            <div className={Styles.createTaskSection}>
              <h2>Create New Task</h2>
              <CreateTaskForm projectId={projectId} />
            </div>

            <div className={Styles.taskList}>
              <h2>Tasks</h2>
              {project.tasks?.length > 0 ? (
                project.tasks.map((task) => (
                  <div key={task.id} className={Styles.taskCard}>
                    <div className={Styles.taskHeader}>
                      <h3>{task.title}</h3>
                      <span className={Styles.taskStatus}>{task.status}</span>
                    </div>
                    <p className={Styles.taskDescription}>{task.description}</p>
                    <div className={Styles.taskMeta}>
                      <span>Priority: {task.priority}</span>
                      {task.start_date && (
                        <span>Start: {new Date(task.start_date).toLocaleDateString()}</span>
                      )}
                      {task.end_date && (
                        <span>End: {new Date(task.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                    <TimeTracker taskId={task.id} />
                  </div>
                ))
              ) : (
                <p className={Styles.text}>No tasks available.</p>
              )}
            </div>
          </>
        )}

        {activeTab === 'team' && (
          <TeamMemberAssignment projectId={projectId} />
        )}

        {activeTab === 'budget' && (
          <BudgetTracker projectId={projectId} />
        )}

        {activeTab === 'progress' && (
          <ProjectProgress projectId={projectId} />
        )}
      </div>

      {/* Back Button */}
      <div className={Styles.buttonGroup}>
        <Buttons name="Back" onClick={handleBack} className={Styles.projectButton} />
      </div>
    </section>
  );
}

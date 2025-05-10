import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

// CSS styles
import Style from "../css modules/ProjectDashboard.module.css";
// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, 
  faFilter, 
  faPlus, 
  faEllipsisV, 
  faCalendarAlt,
  faUser,
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
// Components
import ProjectList from "../components/ProjectList.jsx";

export default function ViewProjectPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // ✅ Grab userId from router state (kept)
  useEffect(() => {
    setUserId(location.state?.userId);
  }, [location]);

  // ✅ Fetch project list with auth (kept and clarified)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get("/projects");
        console.log("✅ Projects fetched:", response.data);
        
        // Handle different API response structures
        let projectsData = [];
        if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data)) {
            projectsData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            projectsData = response.data.data;
          } else if (response.data.projects && Array.isArray(response.data.projects)) {
            projectsData = response.data.projects;
          }
        }
        
        console.log("Processed projects data:", projectsData);
        setProjects(projectsData);
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [location.pathname]); // Add location.pathname as dependency to refresh when navigating back

  function handleLogout() {
    navigate("/", { replace: true });
  }

  function handleNavigation(route) {
    navigate(route);
  }

  // Add function to handle project deletion
  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/projects/${projectId}`);
        // Remove the deleted project from the state
        setProjects(projects.filter(project => project.id !== projectId));
        alert("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project");
      }
    }
  };

  // Add function to handle project editing
  const handleEditProject = (projectId) => {
    navigate(`/projects/${projectId}/edit`);
  };

  // Toggle dropdown menu
  const toggleDropdown = (projectId, event) => {
    event.stopPropagation(); // Prevent event bubbling
    if (activeDropdown === projectId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(projectId);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Filter projects based on search term and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  // Get status icon based on project status
  const getStatusIcon = (status) => {
    if (!status) return null;
    
    switch(status) {
      case "completed":
        return <FontAwesomeIcon icon={faCheckCircle} className={Style.statusIconCompleted} />;
      case "in_progress":
        return <FontAwesomeIcon icon={faClock} className={Style.statusIconInProgress} />;
      case "pending":
        return <FontAwesomeIcon icon={faExclamationCircle} className={Style.statusIconPending} />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className={Style.pageContainer}>
      {/* Header removed completely */}

      <main className={Style.mainContent}>
        <div className={Style.pageTitle}>
          <h1>My Projects</h1>
          <button className={Style.createButton} onClick={() => handleNavigation("/projects/create")}>
            <FontAwesomeIcon icon={faPlus} /> New Project
          </button>
        </div>

        <div className={Style.controlsSection}>
          <div className={Style.searchBar}>
            <FontAwesomeIcon icon={faSearch} className={Style.searchIcon} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={Style.searchInput}
            />
          </div>
          
          <div className={Style.filterControls}>
            <div className={Style.filterSection}>
              <FontAwesomeIcon icon={faFilter} className={Style.filterIcon} />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className={Style.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className={Style.sortSection}>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={Style.sortSelect}
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
              </select>
              <button 
                className={Style.sortOrderButton} 
                onClick={toggleSortOrder}
                title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>

            <div className={Style.viewModeSection}>
              <button 
                className={`${Style.viewModeButton} ${viewMode === "grid" ? Style.active : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <div className={Style.gridIcon}></div>
              </button>
              <button 
                className={`${Style.viewModeButton} ${viewMode === "list" ? Style.active : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <div className={Style.listIcon}></div>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={Style.loadingContainer}>
            <div className={Style.loader}></div>
            <p>Loading projects...</p>
          </div>
        ) : sortedProjects.length === 0 ? (
          <div className={Style.emptyState}>
            <div className={Style.emptyStateIcon}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filters, or create a new project.</p>
            <button className={Style.createButton} onClick={() => handleNavigation("/projects/create")}>
              <FontAwesomeIcon icon={faPlus} /> Create New Project
            </button>
          </div>
        ) : (
          <div className={`${Style.projectList} ${viewMode === "grid" ? Style.gridView : Style.listView}`}>
            {sortedProjects.map(project => (
              <div key={project.id} className={Style.projectCard}>
                <div className={Style.projectCardHeader}>
                  <h3>{project.name}</h3>
                  <div className={Style.projectActions}>
                    <div className={Style.dropdownContainer}>
                      <button 
                        className={Style.actionButton} 
                        onClick={(e) => toggleDropdown(project.id, e)}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      {activeDropdown === project.id && (
                        <div className={Style.dropdownMenu}>
                          <button 
                            className={Style.dropdownItem}
                            onClick={() => handleEditProject(project.id)}
                          >
                            <FontAwesomeIcon icon={faEdit} className={Style.dropdownIcon} />
                            Edit
                          </button>
                          <button 
                            className={Style.dropdownItem}
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} className={Style.dropdownIcon} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className={Style.projectDescription}>{project.description}</p>
                <div className={Style.projectMeta}>
                  <div className={Style.projectStatus}>
                    {getStatusIcon(project.status)}
                    <span className={`${Style.statusText} ${project.status ? Style[`status${project.status.charAt(0).toUpperCase() + project.status.slice(1)}`] : ''}`}>
                      {project.status ? project.status.replace('_', ' ') : 'Unknown'}
                    </span>
                  </div>
                  <div className={Style.projectDate}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                </div>
                <div className={Style.projectFooter}>
                  <div className={Style.projectAssignee}>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{project.assigned_to || "Unassigned"}</span>
                  </div>
                  <button className={Style.viewDetailsButton} onClick={() => handleNavigation(`/project/${project.id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

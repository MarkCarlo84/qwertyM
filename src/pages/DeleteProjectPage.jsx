import axios from "axios";

export default function DeleteProject({ projectId, onProjectDeleted }) {
  const handleDeleteProject = () => {
    // Confirm the delete action
    if (window.confirm("Are you sure you want to delete this project?")) {
      // Send the delete request to the API
      axios
        .delete(`http://127.0.0.1:8000/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authorization-token")}`,
          },
        })
        .then((response) => {
          console.log("Project Deleted:", response.data);
          onProjectDeleted(projectId); // Remove the deleted project from the list
        })
        .catch((error) => {
          console.error("Error deleting project:", error);
          alert("Failed to delete project.");
        });
    }
  };

  return (
    <button onClick={handleDeleteProject}>Delete Project</button>
  );
}

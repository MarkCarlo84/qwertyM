import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "./components/Layout/MainLayout";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Dashboard
import DashboardPage from "./pages/DashboardPage";

// Project Pages
import ViewProjectPage from "./pages/ViewProjectPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

// Task Pages
import TaskListPage from "./pages/TaskListPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import EditTaskPage from "./pages/EditTaskPage";

// Resource Pages
import ResourceManagementPage from "./pages/ResourceManagementPage";
import ResourceAllocationPage from "./pages/ResourceAllocationPage";
import ResourceDetailsPage from "./pages/ResourceDetailsPage";

// Budget Pages
import BudgetTrackingPage from "./pages/BudgetTrackingPage";
import BudgetReportPage from "./pages/BudgetReportPage";

// Report Pages
import ProjectReportsPage from "./pages/ProjectReportsPage";
import RiskTrackingPage from "./pages/RiskTrackingPage";

// Profile Pages
import UserProfilePage from "./pages/UserProfilePage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Project Routes */}
        <Route path="/projects" element={
          <ProtectedRoute>
            <ViewProjectPage />
          </ProtectedRoute>
        } />
        <Route path="/projects/create" element={
          <ProtectedRoute>
            <CreateProjectPage />
          </ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <ProjectDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/projects/:id/edit" element={
          <ProtectedRoute>
            <EditProjectPage />
          </ProtectedRoute>
        } />

        {/* Task Routes */}
        <Route path="/tasks" element={
          <ProtectedRoute>
            <TaskListPage />
          </ProtectedRoute>
        } />
        <Route path="/tasks/create" element={
          <ProtectedRoute>
            <CreateTaskPage />
          </ProtectedRoute>
        } />
        <Route path="/tasks/:id/edit" element={
          <ProtectedRoute>
            <EditTaskPage />
          </ProtectedRoute>
        } />

        {/* Resource Routes */}
        <Route path="/resources" element={
          <ProtectedRoute>
            <ResourceManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/resources/:id" element={
          <ProtectedRoute>
            <ResourceDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/resources/allocate" element={
          <ProtectedRoute>
            <ResourceAllocationPage />
          </ProtectedRoute>
        } />

        {/* Budget Routes */}
        <Route path="/budget" element={
          <ProtectedRoute>
            <BudgetTrackingPage />
          </ProtectedRoute>
        } />
        <Route path="/budget/reports" element={
          <ProtectedRoute>
            <BudgetReportPage />
          </ProtectedRoute>
        } />

        {/* Report Routes */}
        <Route path="/reports" element={
          <ProtectedRoute>
            <ProjectReportsPage />
          </ProtectedRoute>
        } />
        <Route path="/reports/risks" element={
          <ProtectedRoute>
            <RiskTrackingPage />
          </ProtectedRoute>
        } />

        {/* Profile Route */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </MainLayout>
  );
}

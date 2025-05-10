import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">Project Management System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/projects" className={location.pathname.startsWith('/projects') ? 'active' : ''}>
                    Projects
                  </Nav.Link>
                  <Nav.Link as={Link} to="/tasks" className={location.pathname.startsWith('/tasks') ? 'active' : ''}>
                    Tasks
                  </Nav.Link>
                  <Nav.Link as={Link} to="/resources" className={location.pathname.startsWith('/resources') ? 'active' : ''}>
                    Resources
                  </Nav.Link>
                  <Nav.Link as={Link} to="/reports" className={location.pathname.startsWith('/reports') ? 'active' : ''}>
                    Reports
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
            {isAuthenticated && (
              <Nav>
                <NavDropdown 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Profile
                    </span>
                  } 
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1">
        {children}
      </Container>

      <footer className="bg-dark text-light py-3 mt-auto">
        <Container>
          <div className="text-center">
            © {new Date().getFullYear()} Project Management System. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout; 
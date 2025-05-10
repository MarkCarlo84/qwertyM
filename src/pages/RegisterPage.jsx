// React
import React, { useState } from "react";
// CSS style
import styles from "../css modules/LoginPage.module.css";
// React router dom
import { useNavigate } from "react-router-dom";
// Axios
import api from "../api/axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', {
        name,
        email,
        contact,
        password,
        password_confirmation: confirmPassword
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={5}>
            <div className={styles.loginForm}>
              <h2 className={styles.header}>Create an Account</h2>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Full Name</Form.Label>
                  <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
              required
                    className={styles.input}
            />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Email</Form.Label>
                  <Form.Control
                    type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
              required
                    className={styles.input}
            />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Contact Number</Form.Label>
                  <Form.Control
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter your contact number"
              required
                    className={styles.input}
            />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Password</Form.Label>
                  <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
              required
                    className={styles.input}
            />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className={styles.label}>Confirm Password</Form.Label>
                  <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
              required
                    className={styles.input}
            />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className={styles.button}
                >
                  {loading ? "Creating Account..." : "Register"}
                </Button>

                <div className="text-center mt-3">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => navigate("/")}
        >
                      Login
                    </Button>
                  </p>
                </div>
              </Form>
      </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

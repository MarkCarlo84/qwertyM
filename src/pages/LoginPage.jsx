// React
import React, { useState } from "react";
// CSS style
import styles from "../css modules/LoginPage.module.css";
// React router dom
import { useNavigate } from "react-router-dom";
// Axios
import api from "../api/axios";
// Bootstrap
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/login', {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
    setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className={styles.loginForm}>
              <h2 className={styles.header}>Login to Your Account</h2>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
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

                <Form.Group className="mb-4">
                  <Form.Label className={styles.label}>Password</Form.Label>
                  <Form.Control
              type="password"
              value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                  {loading ? "Logging in..." : "Login"}
          </Button>

                <div className="text-center mt-3">
                  <p className="mb-0">
                    Don't have an account?{" "}
          <Button
            variant="link"
                      className="p-0"
                      onClick={() => navigate("/register")}
          >
                      Register
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

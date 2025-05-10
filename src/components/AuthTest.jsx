import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthTest = () => {
  const [authStatus, setAuthStatus] = useState('Checking...');
  const [token, setToken] = useState(localStorage.getItem('authorization-token'));

  useEffect(() => {
    const testAuth = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        setAuthStatus(`Authenticated as: ${response.data.name}`);
      } catch (error) {
        console.error('Auth test error:', error);
        if (error.response) {
          setAuthStatus(`Auth failed: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setAuthStatus('No response from server');
        } else {
          setAuthStatus(`Error: ${error.message}`);
        }
      }
    };

    testAuth();
  }, [token]);

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc' }}>
      <h2>Authentication Test</h2>
      <p>Token: {token ? 'Present' : 'Missing'}</p>
      <p>Status: {authStatus}</p>
    </div>
  );
};

export default AuthTest; 
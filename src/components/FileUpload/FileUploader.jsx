import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, ProgressBar, Alert, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFile } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const FileUploader = ({ projectId, onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    formData.append('description', description);

    try {
      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      setUploadProgress(0);
      setDescription('');
      if (onUploadComplete) {
        onUploadComplete(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
    }
  }, [projectId, description, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10485760 // 10MB
  });

  return (
    <Card className="mb-3">
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>File Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter file description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <div
          {...getRootProps()}
          className={`text-center p-5 border rounded ${
            isDragActive ? 'border-primary' : 'border-dashed'
          }`}
        >
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faUpload} size="2x" className="mb-3" />
          <p>
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select a file'}
          </p>
          <p className="text-muted">Maximum file size: 10MB</p>
        </div>

        {uploadProgress > 0 && (
          <ProgressBar
            now={uploadProgress}
            label={`${uploadProgress}%`}
            className="mt-3"
          />
        )}

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default FileUploader; 
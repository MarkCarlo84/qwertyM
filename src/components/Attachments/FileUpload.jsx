import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ type, id, onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) { // 10MB limit
            setFile(selectedFile);
            setError(null);
        } else {
            setError('File size must be less than 10MB');
            setFile(null);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('attachable_type', type);
        formData.append('attachable_id', id);

        try {
            const response = await axios.post('/api/attachments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadComplete(response.data);
            setFile(null);
            setError(null);
        } catch (error) {
            setError('Error uploading file. Please try again.');
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="file-upload">
            <form onSubmit={handleUpload}>
                <div className="upload-input">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="upload-button"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
                {file && (
                    <p className="file-info">
                        Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                )}
            </form>
        </div>
    );
};

export default FileUpload; 
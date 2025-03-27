import React, { useState } from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import ChatBox from './ChatBox';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [prediction, setPrediction] = useState('');

  // Handle file selection and create a preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle form submission to upload the image
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image before submitting.');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      setUploadMessage('Error uploading file.');
      console.error(error);
    }
  };

  return (
    // The outer Box gives a professional gray background and full viewport height.
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Upload a Frog Image V1.4
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant="contained" component="label">
              Choose File
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {previewUrl && (
              <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">Image Preview:</Typography>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
              </Box>
            )}
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Upload
            </Button>
            {uploadMessage && (
              <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
                {uploadMessage}
              </Typography>
            )}
          </Box>
        </Paper>
        {prediction && (
          <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <ChatBox species={prediction} />
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default ImageUpload;

import React, { useState } from 'react';
import ChatBox from './ChatBox';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [prediction, setPrediction] = useState('');

  // Handle file selection and generate preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle form submission to upload image and get prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image before submitting.');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Server response:', data);
      // Save the prediction to display the chatbox
      setPrediction(data.prediction);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Error uploading file.');
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Upload a Plant Image</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>
          Submit
        </button>
      </form>
      {previewUrl && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Image Preview:</h4>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px' }} />
        </div>
      )}
      {uploadMessage && <p>{uploadMessage}</p>}
      {/* Render ChatBox once a prediction is available */}
      {prediction && <ChatBox species={prediction} />}
    </div>
  );
};

export default ImageUpload;


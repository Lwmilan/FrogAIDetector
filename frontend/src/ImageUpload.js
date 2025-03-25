import React, { useState } from 'react';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image before submitting.');
      return;
    }

    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append('image', image);

    try {
      // Make a POST request to the backend upload endpoint
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Server response:', data);
      setUploadMessage('File uploaded successfully!');
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
      {image && <p>File selected: {image.name}</p>}
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default ImageUpload;

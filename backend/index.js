// Import required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Create an instance of Express
const app = express();

// Enable CORS so that our React frontend can make requests to this server.
app.use(cors());

// Ensure the uploads directory exists, or create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    // Create a unique filename using the current timestamp and the original file name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize Multer with the defined storage
const upload = multer({ storage: storage });

// Dummy AI Inference Function
// This function simulates processing the image and returns a random plant species.
function runDummyInference(filePath) {
  // In a real scenario, you'd load the image file, run it through your model,
  // and return the inference result. For now, we'll randomly choose a plant.
  const plants = ["Rose", "Tulip", "Daisy", "Sunflower", "Lily"];
  const randomIndex = Math.floor(Math.random() * plants.length);
  return plants[randomIndex];
}

// Define a POST route for file uploads
// The field name in the form-data should be 'image'
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('File received:', req.file);
  
  // Run the dummy inference function on the uploaded file.
  // In the future, you would call your actual model here.
  const prediction = runDummyInference(req.file.path);
  
  // Return the file info along with the prediction result.
  res.json({ 
    message: 'File uploaded successfully', 
    file: req.file, 
    prediction: `Predicted plant: ${prediction}`
  });
});

app.post('/chat', express.json(), (req, res) => {
  console.log('Chat payload:', req.body);
  // For now, return a dummy response.
  res.json({ response: `This is a dummy answer about ${req.body.species}.` });
});


// Start the server on port 5000 (or the port defined in the environment variables)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

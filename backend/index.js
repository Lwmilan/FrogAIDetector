import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Instantiate the OpenAI client using your API key.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Dummy inference function that simulates predicting a frog species.
function runDummyInference(filePath) {
  const frogSpecies = [
    "Red-Eyed Tree Frog",
    "Poison Dart Frog",
    "Leopard Frog",
    "Wood Frog",
    "Bullfrog"
  ];
  const randomIndex = Math.floor(Math.random() * frogSpecies.length);
  return frogSpecies[randomIndex];
}

// Endpoint to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('File received:', req.file);
  const prediction = runDummyInference(req.file.path);
  res.json({
    message: 'File uploaded successfully',
    file: req.file,
    prediction: `Predicted species: ${prediction}`
  });
});

// Endpoint to handle chat queries about the frog species.
// It sends the query to ChatGPT via the OpenAI client.
app.post('/chat', async (req, res) => {
  const { species, query } = req.body;

  // Construct the conversation for ChatGPT.
  const messages = [
    {
      role: "system",
      content: "You are an expert herpetologist specialized in frogs. Provide detailed and accurate answers about frog species, including their habitat, behavior, and conservation status."
    },
    {
      role: "user",
      content: `Species: ${species}. Question: ${query}`
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });
    const answer = completion.choices[0].message.content;
    res.json({ response: answer });
  } catch (error) {
    console.error("Error in ChatGPT endpoint:", error);
    res.status(500).json({ response: "Error generating response." });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

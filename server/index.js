const express = require('express');
const cors = require('cors');
const generateMarkdown = require('../utils/generateMarkdown');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', (req, res) => {
  const markdown = generateMarkdown(req.body);
  res.json({ markdown });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

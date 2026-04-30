const generateMarkdown = require('../utils/generateMarkdown');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const markdown = generateMarkdown(req.body);
  res.json({ markdown });
};


require('dotenv').config();
const apiKey = process.env.API_KEY;
function checkApiKey(req, res, next) {
  const clientApiKey = req.headers['x-api-key']; // assuming API key is sent in `x-api-key` header

  if (!clientApiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  if (clientApiKey !== apiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next(); // proceed to the next middleware or route
}

module.exports = checkApiKey;

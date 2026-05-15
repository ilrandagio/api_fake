require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json({ limit: '1mb' }));

const API_KEY = process.env.API_KEY || '';

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'genesys-render-api',
    "api-key":  API_KEY
  });
});

app.post('/genesys', async (req, res) => {
  try {
    if (API_KEY) {
      const providedKey = req.header('x-api-key');
      if (!providedKey || providedKey !== API_KEY) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
    }

    const input = req.body;

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      payload: {
        received: input,
        note: 'Messaggio ricevuto correttamente da Render'
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      detail: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

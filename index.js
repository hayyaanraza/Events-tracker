const express = require('express');
const fetch   = require('node-fetch');
const cors    = require('cors');
const app     = express();

app.use(cors()); // allow all origins

app.get('/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: 'missing url param' });

  const headers = {};
  // Forward auth header if present (for OpenSky)
  if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;

  try {
    const r = await fetch(target, { headers });
    const ct = r.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', ct);
    res.status(r.status).send(await r.text());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
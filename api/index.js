require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { createClient } = require('redis');
const axios = require('axios');

const app = express();
app.use(express.json());

// Postgres connection with retry logic
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'myridelink',
});

const MAX_DB_RETRIES = parseInt(process.env.DB_MAX_RETRIES || '10', 10);
const RETRY_DELAY_MS = parseInt(process.env.DB_RETRY_DELAY_MS || '3000', 10);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectPostgres(attempt = 1) {
  try {
    await pool.query('SELECT 1');
    console.log('📦 Postgres connected');
    startServer();
  } catch (err) {
    if (attempt >= MAX_DB_RETRIES) {
      console.error(`❌ Could not connect to Postgres after ${attempt} attempts:`, err.message);
      process.exit(1);
    }
    console.warn(
      `⚠️  Postgres not ready (attempt ${attempt}/${MAX_DB_RETRIES}). Retrying in ${RETRY_DELAY_MS / 1000}s...`
    );
    await wait(RETRY_DELAY_MS);
    await connectPostgres(attempt + 1);
  }
}

function startServer() {
  // Ensure server is started only once
  if (startServer.started) return;
  startServer.started = true;

  app.listen(3000, () => console.log('🚀 API listening on :3000'));
}

connectPostgres();

const redis = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redis
  .connect()
  .then(() => console.log('⚡ Redis connected'))
  .catch((err) => console.error('Redis connection error', err));

// Health route
app.get('/', (_, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' })
);

// Example Trip-Plan proxy (to OTP2)
app.post('/v1/plan-trip', async (req, res) => {
  const { from, to } = req.body || {};
  if (!from || !to) return res.status(400).json({ error: 'from & to required' });

  const params = new URLSearchParams({
    fromPlace: `${from.lat},${from.lng}`,
    toPlace: `${to.lat},${to.lng}`,
    mode: 'TRANSIT,WALK',
  });

  try {
    const { data } = await axios.get(
      `${process.env.OTP2_URL}/plan?${params.toString()}`
    );
    res.json(data);
  } catch (e) {
    console.error(e.message);
    res.status(502).json({ error: 'OTP2 error' });
  }
});
 
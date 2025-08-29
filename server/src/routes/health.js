const express = require('express');
const { sequelize } = require('../config/database');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'running'
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    res.json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        api: 'running'
      },
      error: 'Database connection failed'
    });
  }
});

module.exports = router;

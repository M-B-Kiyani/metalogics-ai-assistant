const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  session_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  messages: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  lead_captured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lead_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'leads',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'abandoned'),
    defaultValue: 'active'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'conversations',
  indexes: [
    {
      fields: ['session_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = Conversation;

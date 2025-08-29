const express = require('express');
const Joi = require('joi');
const leadService = require('../services/leadService');

const router = express.Router();

// Validation schemas
const leadSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().pattern(/^[\+]?[1-9][\d]{0,15}$/),
  company: Joi.string().optional().max(100),
  message: Joi.string().optional().max(1000),
  sessionId: Joi.string().optional()
});

const appointmentSchema = Joi.object({
  appointment_date: Joi.date().min('now').required(),
  appointment_time: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  address: Joi.string().optional().max(500)
});

// Capture lead
router.post('/', async (req, res) => {
  try {
    const { error, value } = leadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { sessionId, ...leadData } = value;
    
    // Additional validation
    const validationErrors = leadService.validateLeadData(leadData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    const lead = await leadService.captureLead(leadData, sessionId);

    res.json({
      success: true,
      message: 'Lead captured successfully',
      leadId: lead.id,
      data: {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        status: lead.status
      }
    });

  } catch (error) {
    console.error('Error capturing lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to capture lead'
    });
  }
});

// Schedule appointment
router.post('/:leadId/appointment', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { error, value } = appointmentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const lead = await leadService.scheduleAppointment(leadId, value);

    res.json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: {
        leadId: lead.id,
        appointment_date: lead.appointment_date,
        appointment_time: lead.appointment_time,
        status: lead.status
      }
    });

  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to schedule appointment'
    });
  }
});

// Get leads (admin endpoint)
router.get('/', async (req, res) => {
  try {
    const { status, dateFrom, dateTo, limit, offset } = req.query;
    
    const leads = await leadService.getLeads({
      status,
      dateFrom,
      dateTo,
      limit,
      offset
    });

    res.json({
      success: true,
      data: leads.rows,
      total: leads.count,
      pagination: {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      }
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads'
    });
  }
});

// Update lead status (admin endpoint)
router.patch('/:leadId/status', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const lead = await leadService.updateLeadStatus(leadId, status);

    res.json({
      success: true,
      message: 'Lead status updated',
      data: {
        leadId: lead.id,
        status: lead.status
      }
    });

  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update lead status'
    });
  }
});

module.exports = router;

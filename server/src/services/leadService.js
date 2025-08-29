const Lead = require('../models/Lead');
const Conversation = require('../models/Conversation');
const emailService = require('./emailService');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class LeadService {
  async captureLead(leadData, conversationId = null) {
    try {
      // Validate required fields
      const { name, email } = leadData;
      if (!name || !email) {
        throw new Error('Name and email are required');
      }

      // Check if lead already exists
      const existingLead = await Lead.findOne({ where: { email } });
      if (existingLead) {
        // Update existing lead with new information
        await existingLead.update({
          ...leadData,
          conversation_id: conversationId,
          updated_at: new Date()
        });
        return existingLead;
      }

      // Create new lead
      const lead = await Lead.create({
        ...leadData,
        conversation_id: conversationId,
        id: uuidv4()
      });

      // Update conversation if provided
      if (conversationId) {
        await Conversation.update(
          { lead_captured: true, lead_id: lead.id },
          { where: { session_id: conversationId } }
        );
      }

      // Send confirmation email
      await this.sendLeadConfirmation(lead);

      return lead;
    } catch (error) {
      console.error('Error capturing lead:', error);
      throw error;
    }
  }

  async scheduleAppointment(leadId, appointmentData) {
    try {
      const { appointment_date, appointment_time } = appointmentData;
      
      // Validate appointment date/time
      const appointmentDateTime = moment(`${appointment_date} ${appointment_time}`);
      if (!appointmentDateTime.isValid() || appointmentDateTime.isBefore(moment())) {
        throw new Error('Invalid appointment date/time');
      }

      const lead = await Lead.findByPk(leadId);
      if (!lead) {
        throw new Error('Lead not found');
      }

      await lead.update({
        appointment_date: appointmentDateTime.toDate(),
        appointment_time,
        status: 'qualified'
      });

      // Send appointment confirmation
      await this.sendAppointmentConfirmation(lead);

      return lead;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  }

  async sendLeadConfirmation(lead) {
    try {
      const emailData = {
        to: lead.email,
        subject: 'Thank you for your interest in Metalogics',
        template: 'lead_confirmation',
        data: {
          name: lead.name,
          company: lead.company || 'your organization'
        }
      };

      await emailService.sendEmail(emailData);
    } catch (error) {
      console.error('Error sending lead confirmation:', error);
      // Don't throw error - lead capture should succeed even if email fails
    }
  }

  async sendAppointmentConfirmation(lead) {
    try {
      const appointmentDateTime = moment(lead.appointment_date).format('MMMM Do YYYY, h:mm A');
      
      const emailData = {
        to: lead.email,
        subject: 'Appointment Confirmation - Metalogics Consultation',
        template: 'appointment_confirmation',
        data: {
          name: lead.name,
          appointment_date: appointmentDateTime,
          company: lead.company || 'your organization'
        }
      };

      await emailService.sendEmail(emailData);
    } catch (error) {
      console.error('Error sending appointment confirmation:', error);
    }
  }

  async getLeads(filters = {}) {
    try {
      const { status, dateFrom, dateTo, limit = 50, offset = 0 } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (dateFrom || dateTo) {
        whereClause.created_at = {};
        if (dateFrom) whereClause.created_at[Op.gte] = new Date(dateFrom);
        if (dateTo) whereClause.created_at[Op.lte] = new Date(dateTo);
      }

      const leads = await Lead.findAndCountAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return leads;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  async updateLeadStatus(leadId, status) {
    try {
      const lead = await Lead.findByPk(leadId);
      if (!lead) {
        throw new Error('Lead not found');
      }

      await lead.update({ status });
      return lead;
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  }

  validateLeadData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email address is required');
    }
    
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Invalid phone number format');
    }
    
    return errors;
  }
}

module.exports = new LeadService();

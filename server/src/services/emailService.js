const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendEmail(emailData) {
    try {
      const { to, subject, template, data } = emailData;
      
      let htmlContent = '';
      let textContent = '';

      // Generate email content based on template
      switch (template) {
        case 'lead_confirmation':
          htmlContent = this.getLeadConfirmationHTML(data);
          textContent = this.getLeadConfirmationText(data);
          break;
        case 'appointment_confirmation':
          htmlContent = this.getAppointmentConfirmationHTML(data);
          textContent = this.getAppointmentConfirmationText(data);
          break;
        default:
          throw new Error('Unknown email template');
      }

      const msg = {
        to,
        from: process.env.FROM_EMAIL || 'noreply@metalogics.io',
        subject,
        text: textContent,
        html: htmlContent,
      };

      if (process.env.SENDGRID_API_KEY) {
        await sgMail.send(msg);
        console.log(`✅ Email sent to ${to}`);
      } else {
        console.log(`📧 Email would be sent to ${to}: ${subject}`);
        console.log('Content:', textContent);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  getLeadConfirmationHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for your interest in Metalogics</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { padding: 20px; text-align: center; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Metalogics</h1>
          </div>
          <div class="content">
            <h2>Thank you for your interest, ${data.name}!</h2>
            <p>We've received your inquiry and are excited to learn more about how we can help ${data.company} achieve its technology goals.</p>
            <p>Our team will review your request and get back to you within 24 hours. In the meantime, feel free to explore our services and case studies on our website.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://metalogics.io/services" class="button">Explore Our Services</a>
            </p>
            <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Metalogics Team</p>
            <p><a href="https://metalogics.io">metalogics.io</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getLeadConfirmationText(data) {
    return `
Thank you for your interest, ${data.name}!

We've received your inquiry and are excited to learn more about how we can help ${data.company} achieve its technology goals.

Our team will review your request and get back to you within 24 hours. In the meantime, feel free to explore our services and case studies on our website at https://metalogics.io/services.

If you have any urgent questions, please don't hesitate to contact us directly.

Best regards,
The Metalogics Team
https://metalogics.io
    `;
  }

  getAppointmentConfirmationHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Confirmation - Metalogics</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmed</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>Your consultation appointment with Metalogics has been confirmed!</p>
            
            <div class="appointment-details">
              <h3>Appointment Details:</h3>
              <p><strong>Date & Time:</strong> ${data.appointment_date}</p>
              <p><strong>Company:</strong> ${data.company}</p>
              <p><strong>Type:</strong> Technology Consultation</p>
            </div>
            
            <p>We're looking forward to discussing how Metalogics can help transform your technology infrastructure and drive your business forward.</p>
            
            <p>Please prepare any specific questions or challenges you'd like to discuss during our meeting.</p>
            
            <p>If you need to reschedule or have any questions before our meeting, please contact us immediately.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Metalogics Team</p>
            <p><a href="https://metalogics.io">metalogics.io</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getAppointmentConfirmationText(data) {
    return `
Appointment Confirmed - Metalogics

Hello ${data.name},

Your consultation appointment with Metalogics has been confirmed!

Appointment Details:
- Date & Time: ${data.appointment_date}
- Company: ${data.company}
- Type: Technology Consultation

We're looking forward to discussing how Metalogics can help transform your technology infrastructure and drive your business forward.

Please prepare any specific questions or challenges you'd like to discuss during our meeting.

If you need to reschedule or have any questions before our meeting, please contact us immediately.

Best regards,
The Metalogics Team
https://metalogics.io
    `;
  }
}

module.exports = new EmailService();

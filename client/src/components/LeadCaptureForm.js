import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, User, Mail, Phone, Building, MessageSquare, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import apiService from '../services/api';
import "react-datepicker/dist/react-datepicker.css";

const LeadCaptureForm = ({ sessionId, onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleLeadSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await apiService.captureLead({
        ...data,
        sessionId
      });
      
      setLeadId(response.leadId);
      setStep(2);
    } catch (error) {
      console.error('Error capturing lead:', error);
      alert('Failed to save your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async () => {
    if (!selectedDate || !selectedTime || !leadId) return;

    setIsSubmitting(true);
    try {
      await apiService.scheduleAppointment(leadId, {
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // Allow booking up to 2 months ahead

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 h-full flex flex-col"
    >
      {step === 1 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleLeadSubmit)} className="flex-1 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <User size={16} className="mr-2" />
                  Full Name *
                </label>
                <input
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metalogics-blue focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Mail size={16} className="mr-2" />
                  Email Address *
                </label>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metalogics-blue focus:border-transparent"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Phone size={16} className="mr-2" />
                  Phone Number
                </label>
                <input
                  {...register('phone', {
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metalogics-blue focus:border-transparent"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Building size={16} className="mr-2" />
                  Company Name
                </label>
                <input
                  {...register('company')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metalogics-blue focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare size={16} className="mr-2" />
                  Message
                </label>
                <textarea
                  {...register('message')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-metalogics-blue focus:border-transparent resize-none"
                  placeholder="Tell us about your project or requirements"
                />
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-metalogics-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Schedule Consultation</h3>
            <button
              onClick={() => setStep(1)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col space-y-4">
            {/* Date Selection */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="mr-2" />
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                filterDate={isWeekday}
                minDate={minDate}
                maxDate={maxDate}
                inline
                className="w-full"
              />
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="mr-2" />
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-metalogics-blue text-white border-metalogics-blue'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleAppointmentSubmit}
                disabled={!selectedDate || !selectedTime || isSubmitting}
                className="flex-1 px-4 py-2 bg-metalogics-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LeadCaptureForm;

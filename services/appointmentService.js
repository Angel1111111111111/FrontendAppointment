import api from '../config/api';

export const appointmentService = {
  async getAppointments() {
    const response = await api.get('/Appointment');
    return response.data;
  },

  async createAppointment(appointmentData) {
    const response = await api.post('/Appointment', appointmentData);
    return response.data;
  },

  async cancelAppointment(id) {
    const response = await api.delete(`/Appointment/${id}`);
    return response.data;
  },

  async checkAvailability(dateTime) {
    const response = await api.get('/Appointment/available', {
      params: { dateTime: dateTime.toISOString() }
    });
    return response.data;
  }
};
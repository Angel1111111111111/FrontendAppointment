// In exportUtils.js
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const prepareAppointmentsForExport = (appointments, selectedFields) => {
  return appointments.map(appointment => {
    const exportData = {};
    const appointmentDate = new Date(appointment.appointmentDate);

    if (selectedFields.includes('fecha')) {
      exportData['Fecha'] = format(appointmentDate, 'dd/MM/yyyy', { locale: es });
    }

    if (selectedFields.includes('hora')) {
      exportData['Hora'] = format(appointmentDate, 'HH:mm', { locale: es });
    }

    if (selectedFields.includes('paciente')) {
      exportData['Paciente'] = `${appointment.user.firstName} ${appointment.user.lastName}`;
    }

    if (selectedFields.includes('email')) {
      exportData['Email'] = appointment.user.email || 'N/A';
    }

    if (selectedFields.includes('telefono')) {
      exportData['Teléfono'] = appointment.user.phoneNumber || 'N/A';
    }

    if (selectedFields.includes('tratamiento')) {
      exportData['Tratamiento'] = appointment.treatmentType || 'N/A';
    }

    if (selectedFields.includes('estado')) {
      exportData['Estado'] = appointment.status;
    }

    if (selectedFields.includes('notas')) {
      exportData['Notas'] = appointment.notes || 'N/A';
    }

    return exportData;
  });
};

export const exportToExcel = (data, filename) => {
  if (data.length === 0) {
    toast.error('No hay datos para exportar');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Citas');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
  toast.success('Exportación Excel completada');
};
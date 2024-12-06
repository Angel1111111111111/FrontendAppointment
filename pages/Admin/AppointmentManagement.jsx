import { useState, useEffect } from 'react';
import api from '../../config/api';
import toast from 'react-hot-toast';
import { FiDatabase, FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, formatDate } from 'date-fns';
import { BsFiletypeCsv } from 'react-icons/bs';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';
import { FaRegFilePdf } from 'react-icons/fa';
import { RiListView } from 'react-icons/ri';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/Appointment/daily/${selectedDate}`);
      setAppointments(response.data);
    } catch (error) {
      toast.error('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const formatAppointmentTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Hora inválida';
    }
  };

  const exportAppointments = (format) => {
    const appointmentData = appointments.map(appointment => ({
      Fecha: formatDate(new Date(appointment.appointmentDate), 'dd/MM/yyyy'),
      Hora: formatAppointmentTime(appointment.appointmentDate),
      'Nombre Paciente': `${appointment.user.firstName} ${appointment.user.lastName}`,
      'Teléfono': appointment.user.phoneNumber,
      'Tratamiento': appointment.treatmentType,
      'Notas': appointment.notes || 'N/A',
      'Estado': appointment.status
    }));

    switch (format) {
      case 'csv':
        exportToCSV(appointmentData);
        break;
      case 'excel':
        exportToExcel(appointmentData);
        break;
      case 'pdf':
        exportToPDF(appointmentData);
        break;
    }
  };

  const exportToCSV = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Citas');
    XLSX.writeFile(workbook, `Citas_${selectedDate}.csv`);
    toast.success('Exportación CSV completada');
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Citas');
    XLSX.writeFile(workbook, `Citas_${selectedDate}.xlsx`);
    toast.success('Exportación Excel completada');
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();
    // exportación de la fecha y hora
    doc.text(`Exportado el día: ${format(new Date(selectedDate), 'dd/MM/yyyy')}`, 14, 10);
    doc.autoTable({
      startY: 25,
      margin: { top: 50 },
      theme: 'grid',

      head: [['Fecha', 'Hora', 'Paciente', 'Teléfono', 'Tratamiento', 'Estado']],
      body: data.map(appointment => [
        appointment.Fecha,
        appointment.Hora,
        appointment['Nombre Paciente'],
        appointment['Teléfono'],
        appointment['Tratamiento'],
        appointment['Estado']
      ])
    });

    doc.save(`Citas_${selectedDate}.pdf`);
    toast.success('Exportación PDF completada');
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.patch(`/Appointment/${appointmentId}/status`, { status: newStatus });
      toast.success('Estado actualizado exitosamente');
      fetchAppointments();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completada':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiDatabase className='mr-2' /> Administración de Citas
        </h1>
        <div className="mt-4 sm:mt-0 flex space-x-4 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 flex items-center px-3 py-2 text-gray-900"
          />
          <button
            onClick={async () => {
              try {
                const response = await api.get('/Appointment/all');
                setAppointments(response.data);
                toast.success('Citas cargadas exitosamente');
              } catch (error) {
                toast.error('Error al cargar todas las citas');
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <RiListView className='mr-2' /> Ver todas las citas
          </button>
          <div className="relative">
            <button
              className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
              onClick={() => {
                const dropdownMenu = document.getElementById('export-dropdown');
                dropdownMenu.classList.toggle('hidden');
              }}
            >
              <FiDownload className='mr-2' /> Exportar
            </button>
            <div
              id="export-dropdown"
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden"
            >
              <div className="py-1 flex flex-col gap-1 bg-gray-200 rounded-md ">
                <button
                  onClick={() => exportAppointments('csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <BsFiletypeCsv className='mr-2' /> Exportar a CSV
                </button>
                <button
                  onClick={() => exportAppointments('excel')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <PiMicrosoftExcelLogo className='mr-2' /> Exportar a Excel
                </button>
                <button
                  onClick={() => exportAppointments('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaRegFilePdf className='mr-2' /> Exportar a PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
        <div
          className="overflow-y-auto"
          style={{ maxHeight: '430px' }} // Altura fija para la tabla scrollable
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tratamiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay citas programadas para este día
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {format(new Date(appointment.appointmentDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {format(new Date(appointment.appointmentDate), 'HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.user.firstName} {appointment.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.user.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {appointment.treatmentType}
                      {appointment.notes && (
                        <p className="mt-1 text-xs text-gray-400">
                          Nota: {appointment.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(appointment.id, e.target.value)
                        }
                        className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Resumen del Día</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-5">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">Pendientes</p>
            <p className="mt-1 text-2xl font-semibold text-blue-900">
              {appointments.filter((a) => a.status === 'Pendiente').length}
            </p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-800">En Proceso</p>
            <p className="mt-1 text-2xl font-semibold text-yellow-900">
              {appointments.filter((a) => a.status === 'En Proceso').length}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">Completadas</p>
            <p className="mt-1 text-2xl font-semibold text-green-900">
              {appointments.filter((a) => a.status === 'Completada').length}
            </p>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">Canceladas</p>
            <p className="mt-1 text-2xl font-semibold text-red-900">
              {appointments.filter((a) => a.status === 'Cancelada').length}
            </p>
          </div>
          <div className="rounded-lg bg-violet-50 p-4">
            <p className="text-sm font-medium text-violet-800">Total Citas</p>
            <p className="mt-1 text-2xl font-semibold text-violet-900">
              {appointments.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
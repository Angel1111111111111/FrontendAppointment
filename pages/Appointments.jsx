import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import api from '../config/api';
import { FiEdit, FiTrash, FiPlus, FiCalendar, FiSave } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [treatmentTypes] = useState([
    'Limpieza Dental',
    'Extracción',
    'Empaste',
    'Blanqueamiento',
    'Ortodoncia',
    'Revisión General',
    'Radiografía',
    'Endodoncia',
  ]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/Appointment');
      setAppointments(response.data);
    } catch (error) {
      toast.error('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment({
      ...appointment,
      appointmentDate: format(parseISO(appointment.appointmentDate), "yyyy-MM-dd'T'HH:mm"),
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convertir fecha y hora sin modificar la zona horaria
      const appointmentDate = editingAppointment.appointmentDate;
      await api.put(`/Appointment/${editingAppointment.id}`, {
        appointmentDate: appointmentDate,
        treatmentType: editingAppointment.treatmentType,
        notes: editingAppointment.notes,
      });
      toast.success('Cita actualizada exitosamente');
      setIsEditModalOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar la cita');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    try {
      await api.delete(`/Appointment/${id}`);
      toast.success('Cita cancelada exitosamente');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cancelar la cita');
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
          <FiCalendar className="mr-2" /> Mis Citas
        </h1>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/appointments/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <FiPlus className="mr-1" /> Nueva Cita
          </Link>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="mt-6 text-center">
          <p className="text-gray-600">No tienes citas programadas</p>
          <Link
            to="/appointments/new"
            className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <FiPlus className="mr-1" /> Programa tu primera cita
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(appointment.appointmentDate), "d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Hora: {format(new Date(appointment.appointmentDate), 'HH:mm', { locale: es })}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Tratamiento: {appointment.treatmentType}
                    </p>
                    {appointment.notes && (
                      <p className="mt-1 text-sm text-gray-500">Notas: {appointment.notes}</p>
                    )}
                    <p className="mt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${appointment.status === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : appointment.status === 'Completada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    {appointment.status === 'Pendiente' && (
                      <>
                        <button
                          onClick={() => handleEditClick(appointment)}
                          className="rounded bg-white px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-50 flex items-center"
                        >
                          <FiEdit className="mr-1" /> Editar
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="rounded bg-white px-2 py-1 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 flex items-center"
                        >
                          <FiTrash className="mr-1" /> Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Editar Cita
            </Dialog.Title>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={editingAppointment?.appointmentDate || ''}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      appointmentDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Tratamiento
                </label>
                <select
                  value={editingAppointment?.treatmentType || ''}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      treatmentType: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="">Seleccione un tratamiento</option>
                  {treatmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notas
                </label>
                <textarea
                  value={editingAppointment?.notes || ''}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      notes: e.target.value,
                    })
                  }
                  rows="3"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center"
                >
                  <IoClose className="mr-1" /> Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <FiSave className="mr-1" /> Guardar
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

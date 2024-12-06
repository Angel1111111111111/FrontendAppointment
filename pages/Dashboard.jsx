import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../config/api';

export default function Dashboard() {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/Appointment');
        const appointments = response.data.filter(
          appointment => new Date(appointment.appointmentDate) >= new Date()
        );
        setUpcomingAppointments(appointments);
      } catch (error) {
        console.error('Error al cargar las citas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Clinica Dental</h1>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Próximas Citas</h2>
          <div className="mt-4 h-[400px] overflow-hidden">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-600">No tienes citas programadas</p>
            ) : (
              <ul className="space-y-4 overflow-y-auto pr-2 h-full">
                {upcomingAppointments.map((appointment) => (
                  <li 
                    key={appointment.id} 
                    className="rounded-md bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100"
                  >
                    <p className="font-medium text-gray-900">
                      {format(new Date(appointment.appointmentDate), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Tratamiento: {appointment.treatmentType}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Estado: <span className="font-medium">{appointment.status}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Información Útil</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-blue-50 p-4">
              <h3 className="font-medium text-blue-800">Horario de Atención</h3>
              <p className="mt-1 text-sm text-blue-700">
                Lunes a Viernes: 9:00 - 19:00<br />
                Sábados: 9:00 - 14:00
              </p>
            </div>
            <div className="rounded-md bg-green-50 p-4">
              <h3 className="font-medium text-green-800">Contacto de Emergencia</h3>
              <p className="mt-1 text-sm text-green-700">
                Teléfono: (123) 456-7890<br />
                Email: emergencias@clinicadental.com
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Recordatorios</h2>
          <ul className="mt-4 space-y-4">
            <li className="rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Recuerda llegar 10 minutos antes de tu cita programada.
              </p>
            </li>
            <li className="rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Si necesitas cancelar tu cita, hazlo con al menos 24 horas de anticipación.
              </p>
            </li>
            <li className="rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Mantén una buena higiene dental cepillándote los dientes después de cada comida.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
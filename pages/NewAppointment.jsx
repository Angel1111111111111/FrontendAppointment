import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format, addDays, setHours, setMinutes, parse } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../config/api.js';
import { FiCalendar, FiCheckCircle, FiClipboard, FiClock, FiEdit, FiXCircle } from 'react-icons/fi';

const appointmentSchema = Yup.object().shape({
  appointmentDate: Yup.date()
    .min(new Date(), 'La fecha debe ser futura')
    .required('La fecha es requerida'),
  treatmentType: Yup.string()
    .required('El tipo de tratamiento es requerido'),
  notes: Yup.string()
});

const treatmentTypes = [
  'Limpieza Dental',
  'Extracción',
  'Empaste',
  'Blanqueamiento',
  'Ortodoncia',
  'Revisión General',
  'Radiografía',
  'Endodoncia'
];

export default function NewAppointment() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 19; hour++) {
      slots.push(setMinutes(setHours(new Date(), hour), 0));
      slots.push(setMinutes(setHours(new Date(), hour), 30));
    }
    return slots;
  };

  const checkAvailability = async (dateTime) => {
    try {
      setChecking(true);
      const response = await api.get(`/Appointment/available`, { params: { dateTime: dateTime.toISOString() } });
      return response.data.isAvailable;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return false;
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const isAvailable = await checkAvailability(values.appointmentDate);
      if (!isAvailable) {
        toast.error('El horario seleccionado no está disponible');
        return;
      }

      await api.post('/Appointment', values);
      toast.success('Cita agendada exitosamente');
      navigate('/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al agendar la cita');
    } finally {
      setSubmitting(false);
    }
  };

  const combineDateTime = (date, timeSlot) => {
    // Parsear la fecha del input date
    const selectedDate = parse(date, 'yyyy-MM-dd', new Date());

    // Obtener la hora y minutos del timeSlot
    const hours = timeSlot.getHours();
    const minutes = timeSlot.getMinutes();

    // Combinar la fecha seleccionada con la hora seleccionada
    return setMinutes(setHours(selectedDate, hours), minutes);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h1 className="text-2xl font-bold text-gray-900">Nueva Cita</h1>
          <p className="mt-2 text-sm text-gray-600">
            Agenda una nueva cita dental. Selecciona la fecha, hora y tipo de tratamiento que necesitas.
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-blue-50 p-4">
              <h3 className="text-sm font-medium text-blue-800">Horario de Atención</h3>
              <p className="mt-1 text-sm text-blue-700">
                Lunes a Viernes: 9:00 - 19:00<br />
                Sábados: 9:00 - 14:00
              </p>
            </div>
            <div className="rounded-md bg-yellow-50 p-4">
              <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Las citas tienen una duración aproximada de 1 hora.
                Por favor, llega 10 minutos antes de tu cita.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <Formik
            initialValues={{
              appointmentDate: new Date(),
              treatmentType: '',
              notes: ''
            }}
            validationSchema={appointmentSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="rounded-md bg-white p-6 shadow">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <FiCalendar className="mr-2" /> Fecha
                      </label>
                      <div className="mt-1">
                        <Field
                          type="date"
                          name="appointmentDate"
                          value={format(values.appointmentDate, 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const newDate = combineDateTime(
                              e.target.value,
                              values.appointmentDate
                            );
                            setFieldValue('appointmentDate', newDate);
                          }}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      {errors.appointmentDate && touched.appointmentDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <FiClock className="mr-2" /> Hora
                      </label>
                      <div className="mt-1 grid grid-cols-4 gap-2">
                        {generateTimeSlots().map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              const newDateTime = combineDateTime(
                                format(values.appointmentDate, 'yyyy-MM-dd'),
                                slot
                              );
                              setFieldValue('appointmentDate', newDateTime);
                            }}
                            className={`rounded-md px-3 py-2 text-sm font-medium ${format(values.appointmentDate, 'HH:mm') === format(slot, 'HH:mm')
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                          >
                            {format(slot, 'HH:mm')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <FiClipboard className="mr-2" /> Tipo de Tratamiento
                      </label>
                      <Field
                        as="select"
                        name="treatmentType"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Selecciona un tratamiento</option>
                        {treatmentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Field>
                      {errors.treatmentType && touched.treatmentType && (
                        <p className="mt-1 text-sm text-red-600">{errors.treatmentType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <FiEdit className="mr-2" /> Notas adicionales
                      </label>
                      <Field
                        as="textarea"
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Información adicional importante para el dentista..."
                      />
                      {errors.notes && touched.notes && (
                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/appointments')}
                      className="rounded-md bg-red px-3 py-2 text-sm font-semibold text-red-900 flex items-center shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-200"
                    >
                      <FiXCircle className="mr-2" />Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || checking}
                      className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
                    >
                      <FiCheckCircle className="mr-2" />
                      {isSubmitting || checking ? 'Procesando...' : 'Agendar Cita'}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
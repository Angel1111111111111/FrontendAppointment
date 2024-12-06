import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../config/api';

const appointmentSchema = Yup.object().shape({
    appointmentDate: Yup.date().required('La fecha es requerida'),
    appointmentTime: Yup.string().required('La hora es requerida'),
    treatmentType: Yup.string().required('El tipo de tratamiento es requerido'),
    notes: Yup.string(),
});

const treatmentTypes = [
    'Limpieza Dental',
    'Extracción',
    'Empaste',
    'Blanqueamiento',
    'Ortodoncia',
    'Revisión General',
    'Radiografía',
    'Endodoncia',
];

// Función para generar los intervalos de tiempo disponibles
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 19; hour++) {
        const time1 = new Date(0, 0, 0, hour, 0);
        const time2 = new Date(0, 0, 0, hour, 30);
        slots.push({
            label: `${format(time1, 'HH:mm')} - ${format(time2, 'HH:mm')}`,
            value: format(time1, 'HH:mm'),
        });
    }
    return slots;
};

export default function EditAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await api.get(`/Appointment/${id}`);
                setAppointment(response.data);
            } catch (error) {
                toast.error('Error al cargar los detalles de la cita');
                navigate('/appointments');
            }
        };

        fetchAppointment();
    }, [id, navigate]);

    const handleSubmit = async (values) => {
        try {
            // Verifica que los valores se están enviando correctamente
            console.log('Valores a enviar:', values);

            await api.put(`/Appointment/${id}`, values);

            toast.success('Cita actualizada exitosamente');
            navigate('/appointments');
        } catch (error) {
            toast.error('Error al actualizar la cita');
        }
    };

    if (!appointment) return <div>Cargando...</div>;

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {id ? 'Editar Cita' : 'Nueva Cita'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {id ? 'Modifica la cita dental existente.' : 'Crea una nueva cita dental.'}
                    </p>
                </div>
                <div className="md:col-span-2 mt-6 md:mt-0">
                    <Formik
                        initialValues={{
                            appointmentDate: format(new Date(appointment.appointmentDate), 'yyyy-MM-dd'),
                            appointmentTime: appointment.appointmentTime || '',
                            treatmentType: appointment.treatmentType,
                            notes: appointment.notes || '',
                        }}
                        validationSchema={appointmentSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                            <Form className="space-y-6">
                                <div className="rounded-md bg-white p-6 shadow">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fecha
                                        </label>
                                        <div className="mt-1">
                                            <Field
                                                type="date"
                                                name="appointmentDate"
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
                                        <label className="block text-sm font-medium text-gray-700">
                                            Hora
                                        </label>
                                        <div className="mt-1 grid grid-cols-4 gap-2">
                                            {timeSlots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setFieldValue('appointmentTime', slot.value)}
                                                    className={`rounded-md px-3 py-2 text-sm font-medium ${values.appointmentTime === slot.value
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {slot.label}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.appointmentTime && touched.appointmentTime && (
                                            <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tipo de Tratamiento
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
                                        <label className="block text-sm font-medium text-gray-700">
                                            Notas adicionales
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

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/Appointment')}
                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                    >
                                        {isSubmitting ? 'Actualizando...' : 'Actualizar Cita'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

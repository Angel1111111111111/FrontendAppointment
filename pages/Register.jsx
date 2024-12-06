import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  firstName: Yup.string()
    .required('El nombre es requerido'),
  lastName: Yup.string()
    .required('El apellido es requerido'),
  phoneNumber: Yup.string()
    .matches(/^\+?[\d\s-]+$/, 'Número de teléfono inválido')
});

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await register(values);
      toast.success('Registro exitoso');
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crear una cuenta
          </h2>
        </div>
        <Formik
          initialValues={{
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
          }}
          validationSchema={registerSchema}
          onSubmit={(values, actions) => {
            if (!termsAccepted) {
              toast.error('Debes aceptar los términos y condiciones para registrarte.');
              actions.setSubmitting(false);
              return;
            }
            handleSubmit(values, actions);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <Field
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
                >
                  {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-500">¿Ya tienes una cuenta?</span>{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Inicia sesión
                </Link>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Términos y Condiciones
                </Link>
              </div>
              
              <div className="mt-4 text-gray-500">
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      He leído y acepto los términos y condiciones y la política de privacidad
                    </label>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
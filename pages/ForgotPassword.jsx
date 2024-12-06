import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
});

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
      toast.success('Se han enviado las instrucciones a tu correo');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Revisa tu correo</h2>
          <p className="text-gray-600">
            Si existe una cuenta asociada a este correo, recibirás las instrucciones para restablecer tu contraseña.
          </p>
          <div className="mt-4">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Recuperar contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos las instrucciones.
          </p>
        </div>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 space-y-6">
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
                </button>
              </div>

              <div className="text-center text-sm">
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Volver al inicio de sesión
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
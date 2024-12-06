import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido')
    .trim(),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [lastAttempt, setLastAttempt] = useState('');

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    // Prevenir múltiples intentos con el mismo correo
    // if (values.email === lastAttempt) {
    //   await new Promise(resolve => setTimeout(resolve, 1000)); // Pequeño delay
    // }
    // setLastAttempt(values.email);

    // if (!termsAccepted) {
    //   setSubmitting(false);
    //   toast.error('Debes aceptar los términos y condiciones para iniciar sesión');
    //   return;
    // }

    const loadingToast = toast.loading('Iniciando sesión...');
    try {
      const user = await login(values);
      await login(values);
      toast.success('¡Bienvenido de vuelta!', {
        id: loadingToast,
        duration: 3000
      });
      navigate('/', { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message;

      if (errorMessage?.toLowerCase().includes('credenciales')) {
        setFieldError('email', 'Credenciales incorrectas');
        setFieldError('password', 'Credenciales incorrectas');
      } else if (errorMessage?.toLowerCase().includes('email')) {
        setFieldError('email', errorMessage);
      } else if (errorMessage?.toLowerCase().includes('contraseña')) {
        setFieldError('password', errorMessage);
      } else {
        toast.error('Error al iniciar sesión. Por favor, intenta de nuevo.', {
          id: loadingToast
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Iniciar Sesión
          </h2>
        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form className="mt-8 space-y-6" noValidate>
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`mt-1 block w-full rounded-md border ${errors.email && touched.email ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    disabled={isSubmitting || loading}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`mt-1 block w-full rounded-md border ${errors.password && touched.password ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm pr-10`}
                      disabled={isSubmitting || loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="remember"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                    tabIndex={isSubmitting ? -1 : 0}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || loading || !values.email || !values.password}
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting || loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </div>
              <div className="text-center text-sm">
                <span className="text-gray-500">¿No tienes una cuenta?</span>{' '}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  tabIndex={isSubmitting ? -1 : 0}
                >
                  Regístrate
                </Link>
              </div>

              {/* <div className="mt-4 text-center text-sm text-gray-500">
                <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Términos y Condiciones
                </Link>
              </div> */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
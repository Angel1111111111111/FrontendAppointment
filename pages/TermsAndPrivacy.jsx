import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import packageJson from '../../package.json';

export default function TermsAndPrivacy() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones</h1>
        <span className="text-sm text-gray-500">Versión {packageJson.version}</span>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">1. Términos del Servicio</h2>
          <p className="mt-4 text-gray-600">
            Al acceder y utilizar este sistema de gestión dental, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">2. Privacidad de los Datos</h2>
          <p className="mt-4 text-gray-600">
            Nos comprometemos a proteger su privacidad. La información personal recopilada se utilizará únicamente para:
          </p>
          <ul className="mt-2 list-disc pl-5 text-gray-600">
            <li>Gestionar sus citas dentales</li>
            <li>Mantener un registro de su historial médico</li>
            <li>Comunicarnos con usted sobre sus tratamientos</li>
            <li>Enviar recordatorios de citas</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">3. Uso de la Información</h2>
          <p className="mt-4 text-gray-600">
            La información proporcionada en este sistema será utilizada exclusivamente para fines médicos y administrativos relacionados con su atención dental.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">4. Seguridad</h2>
          <p className="mt-4 text-gray-600">
            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra accesos no autorizados, pérdida o alteración.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">5. Sus Derechos</h2>
          <p className="mt-4 text-gray-600">
            Usted tiene derecho a:
          </p>
          <ul className="mt-2 list-disc pl-5 text-gray-600">
            <li>Acceder a sus datos personales</li>
            <li>Solicitar la rectificación de datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al tratamiento de sus datos</li>
          </ul>
        </div>

        {/* <div className="mt-8 space-y-4">
          <div className="flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="terms"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="terms" className="text-sm text-gray-600">
                He leído y acepto los términos y condiciones y la política de privacidad
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              onClick={handleAccept}
              disabled={!accepted}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
            >
              Aceptar y Continuar
            </button>
          </div>
        </div> */}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Aceptar y Continuar
        </Link>
      </div>


      <div className="mt-8 text-center text-sm text-gray-500">
        TodoSistema de Gestión Dental v{packageJson.version}
      </div>
    </div>
  );
}
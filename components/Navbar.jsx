import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Mis Citas', href: '/appointments' },
    { name: 'Nueva Cita', href: '/appointments/new' },
  ];

  const adminNavigation = [
    { name: 'Gestión de Citas', href: '/admin/appointments' },
    { name: 'Gestión de Usuarios', href: '/admin/users' },
  ];

  const isAdmin = hasRole('Admin');

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-xl font-bold text-indigo-600">
                    Clinica Dental
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {user && navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAdmin && adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex items-center rounded-full p-2 text-sm shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <UserCircleIcon className="h-8 w-8 text-indigo-500" aria-hidden="true" />
                      <span className="ml-2 text-sm font-medium text-gray-700">{user.name}</span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="flex items-center px-4 py-3 border-b border-gray-200">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.name}{isAdmin && <span className="ml-1 text-xs text-indigo-600">(Admin)</span>}</p> 
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${active ? 'bg-gray-100' : ''
                                } block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100`}
                            >
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      to="/login"
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-md ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {user && navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              {user ? (
                <div className="space-y-1">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {user.name} ({user.email})
                    {isAdmin && <span className="ml-1 text-xs text-indigo-600">(Admin)</span>}
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="space-y-1 px-4">
                  <Link
                    to="/login"
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-indigo-500"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="block rounded-md bg-white px-3 py-2 text-center text-base font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
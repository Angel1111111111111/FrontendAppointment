import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { roleService } from '../../services/roleService';
import { FiPlus, FiSearch, FiTag, FiTrash, FiUser, FiUserPlus } from 'react-icons/fi';
import { MdOutlineAssignmentInd } from 'react-icons/md';
import { LiaUserShieldSolid } from 'react-icons/lia';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para la búsqueda

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          roleService.getUsersWithRoles(),
          roleService.getRoles(),
        ]);
        setUsers(usersResponse);
        setRoles(rolesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Por favor selecciona un usuario y un rol');
      return;
    }

    try {
      await roleService.assignRole(selectedUser.id, parseInt(selectedRole));
      toast.success('Rol asignado exitosamente');
      setSelectedRole('');
      setSelectedUser(null);
      const updatedUsers = await roleService.getUsersWithRoles();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error(error.response?.data || 'Error al asignar el rol');
    }
  };

  const handleRemoveRole = async (userId, roleId) => {
    try {
      await roleService.removeRole(userId, roleId);
      toast.success('Rol removido exitosamente');
      const updatedUsers = await roleService.getUsersWithRoles();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error(error.response?.data || 'Error al remover el rol');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center">
        <FiUser className="mr-2" /> Administración de Roles
      </h1>

      {/* Campo de búsqueda */}
      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Buscar por correo"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FiSearch className="text-gray-500" />
        </div>
      </div>

      {/* Asignar Rol */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <MdOutlineAssignmentInd className="mr-2" /> Asignar Rol
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={selectedUser?.id || ''}
              onChange={(e) => {
                const user = users.find((u) => u.id === parseInt(e.target.value));
                setSelectedUser(user);
              }}
            >
              <option value="">Selecciona un usuario</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAssignRole}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 flex items-center"
            >
              <FiUserPlus className="mr-2" /> Asignar Rol
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios y roles */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <LiaUserShieldSolid className="mr-2" /> Usuarios y Roles
        </h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Usuario</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Roles</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {user.roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRemoveRole(user.id, role.id)}
                        className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200 items-center mr-2 inline-flex"
                      >
                        <FiTrash className='mr-2' /> {role.name}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

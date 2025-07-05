import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Clock, DollarSign, Shield } from 'lucide-react';
import { Staff } from '../types';
import toast from 'react-hot-toast';

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@srimatha.com',
      phone: '+91 9876543210',
      role: 'chef',
      status: 'active',
      joinDate: '2023-01-15',
      salary: 35000,
      shift: 'morning',
      permissions: ['kitchen', 'inventory']
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@srimatha.com',
      phone: '+91 9876543211',
      role: 'waiter',
      status: 'active',
      joinDate: '2023-03-20',
      salary: 25000,
      shift: 'evening',
      permissions: ['orders', 'customers']
    },
    {
      id: '3',
      name: 'Amit Singh',
      email: 'amit@srimatha.com',
      phone: '+91 9876543212',
      role: 'manager',
      status: 'active',
      joinDate: '2022-11-10',
      salary: 50000,
      shift: 'morning',
      permissions: ['all']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'waiter' as Staff['role'],
    status: 'active' as Staff['status'],
    salary: '',
    shift: 'morning' as Staff['shift'],
    permissions: [] as string[]
  });

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'chef', label: 'Chef' },
    { value: 'waiter', label: 'Waiter' },
    { value: 'manager', label: 'Manager' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'cashier', label: 'Cashier' }
  ];

  const shifts = [
    { value: 'morning', label: 'Morning (6 AM - 2 PM)' },
    { value: 'evening', label: 'Evening (2 PM - 10 PM)' },
    { value: 'night', label: 'Night (10 PM - 6 AM)' }
  ];

  const permissionOptions = [
    { value: 'kitchen', label: 'Kitchen Access' },
    { value: 'orders', label: 'Order Management' },
    { value: 'customers', label: 'Customer Management' },
    { value: 'inventory', label: 'Inventory Access' },
    { value: 'reports', label: 'Reports Access' },
    { value: 'settings', label: 'Settings Access' },
    { value: 'all', label: 'All Permissions' }
  ];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: Staff['role']) => {
    switch (role) {
      case 'chef': return 'bg-orange-100 text-orange-800';
      case 'waiter': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'delivery': return 'bg-green-100 text-green-800';
      case 'cashier': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftColor = (shift: Staff['shift']) => {
    switch (shift) {
      case 'morning': return 'bg-yellow-100 text-yellow-800';
      case 'evening': return 'bg-orange-100 text-orange-800';
      case 'night': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const staffData: Staff = {
      id: editingStaff?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      joinDate: editingStaff?.joinDate || new Date().toISOString().split('T')[0],
      salary: parseFloat(formData.salary),
      shift: formData.shift,
      permissions: formData.permissions
    };

    if (editingStaff) {
      setStaff(prev => prev.map(member => member.id === editingStaff.id ? staffData : member));
      toast.success('Staff member updated successfully!');
    } else {
      setStaff(prev => [...prev, staffData]);
      toast.success('Staff member added successfully!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'waiter',
      status: 'active',
      salary: '',
      shift: 'morning',
      permissions: []
    });
    setEditingStaff(null);
    setShowAddModal(false);
  };

  const handleEdit = (member: Staff) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
      salary: member.salary?.toString() || '',
      shift: member.shift || 'morning',
      permissions: member.permissions
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete staff member "${name}"?`)) {
      setStaff(prev => prev.filter(member => member.id !== id));
      toast.success('Staff member deleted successfully!');
    }
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getStaffStats = () => {
    const total = staff.length;
    const active = staff.filter(s => s.status === 'active').length;
    const totalSalary = staff.reduce((sum, s) => sum + (s.salary || 0), 0);
    const avgSalary = totalSalary / staff.length || 0;
    
    return { total, active, totalSalary, avgSalary };
  };

  const stats = getStaffStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
          <p className="text-gray-600">Manage your restaurant staff and their roles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
        >
          <Plus size={20} />
          Add Staff Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Users className="text-blue-600 mr-3" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Staff</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Shield className="text-green-600 mr-3" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <DollarSign className="text-purple-600 mr-3" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-800">₹{stats.totalSalary.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Salary</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Clock className="text-orange-600 mr-3" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-800">₹{Math.round(stats.avgSalary).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Avg Salary</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300">
            Export Staff List
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Shift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-orange-600 font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">
                          Joined: {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                      {member.shift && (
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getShiftColor(member.shift)}`}>
                            {member.shift}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {member.salary && (
                        <div className="text-sm font-medium text-gray-900">
                          ₹{member.salary.toLocaleString()}/month
                        </div>
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit staff member"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete staff member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No staff members found</div>
            <div className="text-gray-400 text-sm">Try adjusting your filters</div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as Staff['role'] }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      {roles.slice(1).map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Salary (₹)</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Shift</label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as Staff['shift'] }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {shifts.map(shift => (
                        <option key={shift.value} value={shift.value}>{shift.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Staff['status'] }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Permissions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {permissionOptions.map(permission => (
                      <label key={permission.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.value)}
                          onChange={() => togglePermission(permission.value)}
                          className="mr-2 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    {editingStaff ? 'Update' : 'Add'} Staff Member
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
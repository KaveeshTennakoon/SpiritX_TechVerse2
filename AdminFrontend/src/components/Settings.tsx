import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

function Settings() {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    tournamentName: 'University Cricket League 2025',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear password error when user starts typing new passwords
    if (name === 'newPassword' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSave = () => {
    // Validate passwords match if new password is being set
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        return;
      }
    }

    // Update user context
    updateUser({
      name: formData.name,
      email: formData.email,
    });

    // Show success message
    setSaveMessage('Settings updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>

      {saveMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
        {/* Profile Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Tournament Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Tournament Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Name
              </label>
              <input
                type="text"
                name="tournamentName"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tournamentName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
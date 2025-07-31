import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { User, Edit3, Save, X, MapPin, Building, Globe } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    institution: user?.profile?.institution || '',
    country: user?.profile?.country || ''
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Please login to view your profile
          </h1>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile({ profile: formData });
      setIsEditing(false);
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully'
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      institution: user?.profile?.institution || '',
      country: user?.profile?.country || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and coding statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Avatar and Username */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.username}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {user.profile?.firstName || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {user.profile?.lastName || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institution
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {user.profile?.institution || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {user.profile?.country || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          {/* Coding Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Coding Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Problems Solved</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {user.stats.problemsSolved}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Submissions</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.stats.totalSubmissions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Accepted</span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {user.stats.acceptedSubmissions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {user.stats.totalSubmissions > 0 
                    ? ((user.stats.acceptedSubmissions / user.stats.totalSubmissions) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Rating</span>
                <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {user.stats.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Username</div>
                  <div className="font-medium text-gray-900 dark:text-white">{user.username}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Role</div>
                  <div className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</div>
                </div>
              </div>
              {user.profile?.institution && (
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Institution</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.profile.institution}</div>
                  </div>
                </div>
              )}
              {user.profile?.country && (
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Country</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.profile.country}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
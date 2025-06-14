import React, { useState } from 'react';
import { User as UserIcon, Save, Building2, Phone, Mail, BadgeCheck, MapPin, Hash } from 'lucide-react';
import useAuth from '../../context_store/auth_store';

const User = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contactNo: user?.contactNo || '',
    officeName: user?.officeName || '',
    officeAddress: user?.officeAddress || '',
    officeContacts: user?.officeContacts || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactChange = (index, value) => {
    const newContacts = [...formData.officeContacts];
    newContacts[index] = value;
    setFormData(prev => ({
      ...prev,
      officeContacts: newContacts
    }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      officeContacts: [...prev.officeContacts, '']
    }));
  };

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      officeContacts: prev.officeContacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

//   console.log(user)
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-blue-500 p-3 rounded-full">
          <UserIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">User Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full pl-10 px-4 py-2 rounded-lg bg-[#3A3A4D] text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full pl-10 px-4 py-2 rounded-lg bg-[#3A3A4D] text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Contact Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full pl-10 px-4 py-2 rounded-lg bg-[#3A3A4D] text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            User Type
          </label>
          <div className="relative">
            <BadgeCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={user?.userType || ''}
              disabled
              className="w-full pl-10 px-4 py-2 rounded-lg bg-[#3A3A4D] text-white border border-gray-600 opacity-50"
            />
          </div>
        </div>

        {/* Agent specific fields */}
        {user?.userType === 'Agent' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              License Number
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={user?.licenseNo || ''}
                disabled
                className="w-full pl-10 px-4 py-2 rounded-lg bg-[#3A3A4D] text-white border border-gray-600 opacity-50"
              />
            </div>
          </div>
        )}

        {/* Organization specific fields */}
        {user?.userType === 'Organization' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Office Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="officeName"
                  value={formData.officeName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 px-4 py-2 rounded-lg bg-[#3A3A4D] text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Office Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 px-4 py-2 rounded-lg bg-[#3A3A4D] text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Office Contacts
              </label>
              <div className="space-y-2">
                {formData.officeContacts.map((contact, index) => (
                  <div key={index} className="flex space-x-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => handleContactChange(index, e.target.value)}
                        disabled={!isEditing}
                        className="w-full pl-10 px-4 py-2 rounded-lg bg-[#3A3A4D] text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="px-3 py-2 text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    type="button"
                    onClick={addContact}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    + Add Contact
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    contactNo: user?.contactNo || '',
                    officeName: user?.officeName || '',
                    officeAddress: user?.officeAddress || '',
                    officeContacts: user?.officeContacts || [],
                  });
                }}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default User; 
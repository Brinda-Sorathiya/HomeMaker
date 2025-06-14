import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../context_store/auth_store';
import { Plus, X } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, loading, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'Individual',
    contactNo: '',
    officeName: '',
    officeAddress: '',
    officeContacts: [''],
    licenseNo: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const handleOfficeContactChange = (index, value) => {
    const newContacts = [...formData.officeContacts];
    newContacts[index] = value;
    setFormData({ ...formData, officeContacts: newContacts });
  };

  const addOfficeContact = () => {
    setFormData({
      ...formData,
      officeContacts: [...formData.officeContacts, '']
    });
  };

  const removeOfficeContact = (index) => {
    const newContacts = formData.officeContacts.filter((_, i) => i !== index);
    setFormData({ ...formData, officeContacts: newContacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        contactNo: formData.contactNo
      };

      if (formData.userType === 'Organization') {
        userData.officeName = formData.officeName;
        userData.officeAddress = formData.officeAddress;
        userData.officeContacts = formData.officeContacts.filter(contact => contact.trim() !== '');
      } else if (formData.userType === 'Agent') {
        userData.licenseNo = formData.licenseNo;
      }

      await register(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
      
      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Housing Market</h1>
          <p className="text-gray-400">Your Gateway to Premium Properties</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#282A36] rounded-xl shadow-2xl p-8 border border-gray-800">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Create Account</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition duration-200"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition duration-200"
                placeholder="Enter your contact number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">I am a</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition duration-200"
              >
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
                <option value="Agent">Agent</option>
              </select>
            </div>

            {formData.userType === 'Organization' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Office Name</label>
                  <input
                    type="text"
                    name="officeName"
                    value={formData.officeName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition duration-200"
                    placeholder="Enter office name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Office Address</label>
                  <textarea
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition duration-200"
                    placeholder="Enter office address"
                    required
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Office Contact Numbers</label>
                  {formData.officeContacts.map((contact, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => handleOfficeContactChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition duration-200"
                        placeholder="Enter office contact number"
                        required={index === 0}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeOfficeContact(index)}
                          className="p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOfficeContact}
                    className="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Contact
                  </button>
                </div>
              </>
            )}

            {formData.userType === 'Agent' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNo"
                  value={formData.licenseNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#3A3A4D] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition duration-200"
                  placeholder="Enter your license number"
                  required
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 bg-[#3A3A4D] text-blue-500 focus:ring-blue-500"
                required
              />
              <label className="ml-2 text-sm text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition duration-200">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition duration-200">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#282A36] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition duration-200 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Social Login Options */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1A1A2E] text-gray-400">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg bg-[#282A36] text-gray-300 hover:bg-[#3A3A4D] transition duration-200">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg bg-[#282A36] text-gray-300 hover:bg-[#3A3A4D] transition duration-200">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675,0H1.325C0.593,0,0,0.593,0,1.325v21.351C0,23.407,0.593,24,1.325,24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1,1.893-4.788,4.659-4.788c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763v2.313h3.587l-0.467,3.622h-3.12V24h6.116c0.73,0,1.323-0.593,1.323-1.325V1.325C24,0.593,23.407,0,22.675,0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 
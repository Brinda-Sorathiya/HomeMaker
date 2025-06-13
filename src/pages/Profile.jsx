import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Heart, History, Menu, LogOut, X } from 'lucide-react';
import AddProperty from '../components/profile/property/Property';
import Wishlist from '../components/profile/Wishlist';
import Transactions from '../components/profile/Transactions';
import useAuth from '../context_store/auth_store';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  {
    icon: PlusCircle,
    label: 'Add Property',
    component: AddProperty,
  },
  {
    icon: Heart,
    label: 'Wishlist',
    component: Wishlist,
  },
  {
    icon: History,
    label: 'Transactions',
    component: Transactions,
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Add Property');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const ActiveComponent = sidebarItems.find(item => item.label === activeTab)?.component;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
            <span>Menu</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                />
                
                {/* Sidebar */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed top-0 left-0 h-full w-64 bg-[#282A36] z-50 md:hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white">Profile Menu</h2>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <nav className="space-y-2">
                      {sidebarItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            setActiveTab(item.label);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                            activeTab === item.label
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-300 hover:bg-[#3A3A4D] hover:text-white'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                      
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-red-400 hover:bg-red-500 hover:text-white mt-4"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-[#282A36] rounded-lg p-4">
              <h2 className="text-xl font-bold text-white mb-6 px-4">Profile Menu</h2>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.label)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.label
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-[#3A3A4D] hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-red-400 hover:bg-red-500 hover:text-white mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#282A36] rounded-lg p-6"
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
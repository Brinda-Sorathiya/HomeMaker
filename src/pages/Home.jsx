import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Building2, Heart, Shield, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Home,
    title: 'Find Your Dream Home',
    description: 'Discover the perfect property that matches your lifestyle and preferences.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Advanced filters and search options to find exactly what you\'re looking for.',
  },
  {
    icon: Building2,
    title: 'Premium Properties',
    description: 'Access to exclusive listings and luxury real estate opportunities.',
  },
  {
    icon: Heart,
    title: 'Save Favorites',
    description: 'Keep track of your favorite properties and get notified of updates.',
  },
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Safe and secure property transactions with our trusted platform.',
  },
  {
    icon: TrendingUp,
    title: 'Market Insights',
    description: 'Stay informed with real-time market trends and property values.',
  },
];

const stats = [
  { value: '10K+', label: 'Properties Listed' },
  { value: '5K+', label: 'Happy Clients' },
  { value: '98%', label: 'Success Rate' },
  { value: '24/7', label: 'Support' },
];

const Homepage = () => {
  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1A1A2E] to-[#282A36]">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl font-bold text-white mb-6 gradient-text">
                Find Your Perfect Home
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover the best properties in your desired location. We make finding your dream home easy and enjoyable.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-hover bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Get Started
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
                  alt="Luxury Home"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-[#282A36] py-20">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We provide the best real estate experience with our comprehensive features and dedicated service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                }}
                className="feature-card bg-[#1A1A2E] p-6 rounded-lg cursor-pointer border border-gray-800"
              >
                <feature.icon className="w-12 h-12 text-blue-500 mb-4 feature-icon" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 
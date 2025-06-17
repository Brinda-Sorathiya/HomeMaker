// In Wishlist.jsx
import React from 'react';
import useProperty from '../../context_store/property_store';
import PropertyCard from '../cards/PropertyCard';
import useAuth from '../../context_store/auth_store';

const Wishlist = () => {
  const { wishlist, loading, error } = useProperty();

  return (
    <div className="min-h-screen bg-[#1A1A2E] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">My Wishlist</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-[#282A36] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400">
              Start adding properties to your wishlist by clicking the heart icon on any property card.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((property) => (
              <PropertyCard key={property.apn} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
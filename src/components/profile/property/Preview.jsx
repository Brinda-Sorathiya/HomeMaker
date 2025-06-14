import React, { useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import useAuth from '../../../context_store/auth_store';
import useProperty from '../../../context_store/property_store';
import PropertyCard from '../../cards/PropertyCard';

const AddPropertyPreview = ({ onAddClick }) => {
  const { user } = useAuth();
  const { myproperties, loading, error } = useProperty();


  return (
    <div className="min-h-screen bg-[#1A1A2E] p-4">
      {/* Add Property Button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={onAddClick}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative flex items-center space-x-2 bg-[#282A36] px-6 py-3 rounded-lg">
            <PlusCircle className="w-6 h-6 text-blue-500" />
            <span className="text-white font-medium">Add New Property</span>
          </div>
        </button>
      </div>

      {/* Properties List */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Your Properties</h2>
        
        {loading ? (
          <div className="text-white">Loading properties...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : myproperties.length === 0 ? (
          <div className="text-gray-400">No properties found. Add your first property!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myproperties.map((property) => (
              <PropertyCard key={property.apn} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPropertyPreview; 
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import PropertyCard from '../components/cards/PropertyCard';
import useProperty from '../context_store/property_store';

const Explore = () => {
  const { properties, loading, error} = useProperty();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter(property => {
    if (!property) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (property.title?.toLowerCase() || '').includes(searchLower) ||
      (property.city?.toLowerCase() || '').includes(searchLower) ||
      (property.state?.toLowerCase() || '').includes(searchLower) ||
      (property.district?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#1A1A2E] p-8">
      <div className="max-w-8xl mx-auto">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-[#282A36] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#282A36] rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Explore Properties</h1>
          
          {loading ? (
            <div className="text-white">Loading properties...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-gray-400">No properties found</div>
          ) : (
            <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.apn} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore; 
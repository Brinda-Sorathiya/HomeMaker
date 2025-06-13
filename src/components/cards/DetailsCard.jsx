import React from 'react';
import { MapPin, Bed, Bath, Square, Home, Calendar, Building2 } from 'lucide-react';

const DetailsCard = ({ property }) => {
  const {
    title,
    type,
    state,
    city,
    district,
    local_address,
    area,
    available_for,
    monthly_rent,
    price,
    security_deposit,
    images,
    status,
    floors,
    built_year,
    neighborhood_info,
    individual_amenities,
    shared_amenities
  } = property;

  // Calculate total facilities across all floors
  const totalFacilities = floors?.reduce((acc, floor) => ({
    beds: (acc.beds || 0) + (floor.bedroom_no || 0),
    baths: (acc.baths || 0) + (floor.bath_no || 0),
    halls: (acc.halls || 0) + (floor.hall_no || 0)
  }), { beds: 0, baths: 0, halls: 0 }) || { beds: 0, baths: 0, halls: 0 };

  return (
    <div className="bg-[#1E1F2B] rounded-lg overflow-hidden shadow-lg">
      {/* Image Gallery */}
      <div className="relative h-96">
        <img
          src={images?.[0]?.url || 'https://via.placeholder.com/1200x800'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          {status}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Type */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 text-lg">{type}</p>
        </div>

        {/* Location */}
        <div className="mb-6">
          <div className="flex items-center text-gray-400 mb-2">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg">{`${local_address}, ${district}, ${city}, ${state}`}</span>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#282A36] p-4 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Square className="w-5 h-5 mr-2" />
              <span>Area</span>
            </div>
            <p className="text-white text-lg">{area} sq ft</p>
          </div>
          <div className="bg-[#282A36] p-4 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Bed className="w-5 h-5 mr-2" />
              <span>Bedrooms</span>
            </div>
            <p className="text-white text-lg">{totalFacilities.beds}</p>
          </div>
          <div className="bg-[#282A36] p-4 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Bath className="w-5 h-5 mr-2" />
              <span>Bathrooms</span>
            </div>
            <p className="text-white text-lg">{totalFacilities.baths}</p>
          </div>
          <div className="bg-[#282A36] p-4 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Home className="w-5 h-5 mr-2" />
              <span>Halls</span>
            </div>
            <p className="text-white text-lg">{totalFacilities.halls}</p>
          </div>
        </div>

        {/* Floor Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Floor Details</h2>
          <div className="space-y-4">
            {floors?.map((floor, index) => (
              <div key={index} className="bg-[#282A36] p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Floor {floor.floor_no}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400">Bedrooms</p>
                    <p className="text-white">{floor.bedroom_no}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Bathrooms</p>
                    <p className="text-white">{floor.bath_no}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Halls</p>
                    <p className="text-white">{floor.hall_no}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Kitchens</p>
                    <p className="text-white">{floor.kitchen_no}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Property Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#282A36] p-4 rounded-lg">
              <div className="flex items-center text-gray-400 mb-1">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Built Year</span>
              </div>
              <p className="text-white">{built_year}</p>
            </div>
            <div className="bg-[#282A36] p-4 rounded-lg">
              <div className="flex items-center text-gray-400 mb-1">
                <Building2 className="w-5 h-5 mr-2" />
                <span>Available For</span>
              </div>
              <p className="text-white">{available_for}</p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Individual Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {individual_amenities?.map((amenity, index) => (
                  <span key={index} className="bg-[#282A36] text-white px-3 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Shared Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {shared_amenities?.map((amenity, index) => (
                  <span key={index} className="bg-[#282A36] text-white px-3 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Neighborhood Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Neighborhood Information</h2>
          <p className="text-gray-400">{neighborhood_info}</p>
        </div>

        {/* Pricing */}
        <div className="bg-[#282A36] p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Pricing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {available_for === 'Rent' && (
              <>
                <div>
                  <p className="text-gray-400">Monthly Rent</p>
                  <p className="text-white text-2xl font-semibold">₹{monthly_rent}/month</p>
                </div>
                <div>
                  <p className="text-gray-400">Security Deposit</p>
                  <p className="text-white text-2xl font-semibold">₹{security_deposit}</p>
                </div>
              </>
            )}
            {available_for === 'Sell' && (
              <div>
                <p className="text-gray-400">Selling Price</p>
                <p className="text-white text-2xl font-semibold">₹{price}</p>
              </div>
            )}
            {available_for === 'Both' && (
              <>
                <div>
                  <p className="text-gray-400">Monthly Rent</p>
                  <p className="text-white text-2xl font-semibold">₹{monthly_rent}/month</p>
                </div>
                <div>
                  <p className="text-gray-400">Security Deposit</p>
                  <p className="text-white text-2xl font-semibold">₹{security_deposit}</p>
                </div>
                <div>
                  <p className="text-gray-400">Selling Price</p>
                  <p className="text-white text-2xl font-semibold">₹{price}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsCard; 
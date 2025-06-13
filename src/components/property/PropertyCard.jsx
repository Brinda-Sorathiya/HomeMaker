import React from 'react';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const {
    Title,
    Type,
    State,
    City,
    District,
    Area,
    Available_For,
    Monthly_Rent,
    Price,
    Images,
    Status
  } = property;

  const mainImage = Images?.[0]?.url || 'https://via.placeholder.com/400x300';

  return (
    <div className="bg-[#282A36] rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={mainImage}
          alt={Title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
          {Status}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{Title}</h3>
        <p className="text-gray-400 mb-2">{Type}</p>

        {/* Location */}
        <div className="flex items-center text-gray-400 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{`${District}, ${City}, ${State}`}</span>
        </div>

        {/* Details */}
        <div className="flex justify-between text-gray-400 mb-4">
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{Area} sq ft</span>
          </div>
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>3 Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>2 Baths</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <div className="text-white font-semibold">
            {Available_For === 'Rent' && `₹${Monthly_Rent}/month`}
            {Available_For === 'Sell' && `₹${Price}`}
            {Available_For === 'Both' && (
              <>
                <div>Rent: ₹{Monthly_Rent}/month</div>
                <div>Sell: ₹{Price}</div>
              </>
            )}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 
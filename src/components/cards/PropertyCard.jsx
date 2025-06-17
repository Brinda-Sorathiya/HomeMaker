import React, { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Home, Utensils, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProperty from '../../context_store/property_store';
import useAuth from '../../context_store/auth_store';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentInsightProperty, addToWishlist, removeFromWishlist, wishlist } = useProperty();
  const [isWishlisted, setIsWishlisted] = useState(property.is_wish);
  const {
    title,
    type,
    state,
    city,
    district,
    area,
    available_for,
    monthly_rent,
    price,
    images,
    status,
    floors,
    apn
  } = property;

  useEffect(() => {
    setIsWishlisted(property.is_wish);
  }, [property.is_wish]);

  const mainImage = images?.[0]?.url || 'https://via.placeholder.com/400x300';

  // Calculate total facilities across all floors
  const totalFacilities = floors?.reduce((acc, floor) => {
    // console.log('Processing floor:', floor);
    const result = {
      beds: (acc.beds || 0) + (Number(floor.bedroomNo) || 0),
      baths: (acc.baths || 0) + (Number(floor.bathNo) || 0),
      halls: (acc.halls || 0) + (Number(floor.hallNo) || 0),
      kitchens: (acc.kitchens || 0) + (Number(floor.kitchenNo) || 0)
    };
    // console.log('Running total:', result);
    return result;
  }, { beds: 0, baths: 0, halls: 0, kitchens: 0 }) || { beds: 0, baths: 0, halls: 0, kitchens: 0 };

  // console.log('Final totalFacilities:', totalFacilities);

  const handleViewDetails = () => {
    setCurrentInsightProperty(property);
    navigate(`/insights/${apn}`);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      
      setIsWishlisted(!isWishlisted);
      property.is_wish = !isWishlisted;

      if (isWishlisted) {
        //property should be removed from wishlist
        useProperty.setState(state => ({
          wishlist: state.wishlist.filter(p => p.apn !== property.apn)
        }));
      } else {
        //property should be added in wishlist
        useProperty.setState(state => ({
          wishlist: [...state.wishlist, property]
        }));
      }

      if (isWishlisted) {
        await removeFromWishlist(property.apn, user.id);
      } else {
        await addToWishlist(property.apn, user.id);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <div className="bg-[#1E1F2B] rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
          {status}
        </div>
        {available_for && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
            {available_for}
          </div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <Heart
            className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-2">{type}</p>

        {/* Location */}
        <div className="flex items-center text-gray-400 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{`${district}, ${city}, ${state}`}</span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-gray-400 mb-4">
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{area} sqft</span>
          </div>
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{totalFacilities.beds} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{totalFacilities.baths} Baths</span>
          </div>
          <div className="flex items-center">
            <Home className="w-4 h-4 mr-1" />
            <span>{totalFacilities.halls} Halls</span>
          </div>
          <div className="flex items-center">
            <Utensils className="w-4 h-4 mr-1" />
            <span>{totalFacilities.kitchens} Kits</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <div className="text-white font-semibold">
            {available_for === 'Rent' && `₹${monthly_rent}/month`}
            {available_for === 'Sell' && `₹${price}`}
            {available_for === 'Both' && (
              <>
                <div>Rent: ₹{monthly_rent}/month</div>
                <div>Sell: ₹{price}</div>
              </>
            )}
          </div>
          <button 
            onClick={handleViewDetails}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
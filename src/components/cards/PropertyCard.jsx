import React, { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Home, Utensils, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProperty from '../../context_store/property_store';
import useAuth from '../../context_store/auth_store';

const PropertyCard = ({ property, onClick }) => {
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
    const result = {
      beds: (acc.beds || 0) + (Number(floor.bedroomNo) || 0),
      baths: (acc.baths || 0) + (Number(floor.bathNo) || 0),
      halls: (acc.halls || 0) + (Number(floor.hallNo) || 0),
      kitchens: (acc.kitchens || 0) + (Number(floor.kitchenNo) || 0)
    };
    return result;
  }, { beds: 0, baths: 0, halls: 0, kitchens: 0 }) || { beds: 0, baths: 0, halls: 0, kitchens: 0 };

  const handleViewDetails = () => {
    setCurrentInsightProperty(property);
    if (onClick) onClick();
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
        useProperty.setState(state => ({
          wishlist: state.wishlist.filter(p => p.apn !== property.apn)
        }));
      } else {
        useProperty.setState(state => ({
          wishlist: [...state.wishlist, property]
        }));
      }
      if (isWishlisted) {
        await removeFromWishlist(property.apn);
      } else {
        await addToWishlist(property.apn);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <div className="bg-[#1E1F2B] rounded-lg overflow-hidden shadow-lg transition-transform min-w-[200px] max-w-[250px] hover:scale-105 ">
      {/* Image */}
      <div className="relative h-28">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute top-1 right-1 bg-blue-500 text-white px-1.5 py-0.5 rounded text-s">
          {status}
        </div> */}
        {available_for && (
          <div className="absolute top-1 right-1 bg-green-500 text-white px-1.5 py-0.5 rounded text-s">
            {available_for}
          </div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute bottom-1 right-1 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-2">
        <h3 className="text-base font-semibold text-white mb-1 truncate">{title}</h3>
        <p className="text-s text-gray-400 mb-1 truncate">{type}</p>

        {/* Location */}
        <div className="flex items-center text-gray-400 mb-2 text-s truncate">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{`${district}, ${city}, ${state}`}</span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-gray-400 mb-2 text-s">
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
          <div className="text-white font-semibold text-s">
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
            className="bg-blue-500 text-white px-2 py-1 rounded text-s hover:bg-blue-600 transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
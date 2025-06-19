import React, { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Home, Calendar, Building2, Utensils, Sparkles, BookOpen, IndianRupee, Phone, Layers, Edit, ChevronLeft, ChevronRight, X } from 'lucide-react';
import EditPropertyCard from './EditPropertyCard';
import useProperty from '../../context_store/property_store.js';
import useAuth from '../../context_store/auth_store.js';

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
    shared_amenities,
    owner_id,
    owner_email,
    owner_phone_number
  } = property;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && images?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 5000); // Change image every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, images]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentImageIndex((prev) => 
      (prev + 1) % images.length
    );
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentImageIndex(index);
  };

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

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await useProperty.getState().updateProperty(property.apn, updatedData);
      console.log("Property updated successfully!");
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const { user } = useAuth();
  const currentUserId = user?.id;

  const handleImageClick = () => {
    setIsFullscreen(true);
    setIsAutoPlaying(false);
  };

  const handleCloseFullscreen = (e) => {
    if (e.target === e.currentTarget) {
      setIsFullscreen(false);
    }
  };

  if (isEditing) {
    return (
      <EditPropertyCard 
        property={property}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="bg-[#1E1F2B] rounded-lg overflow-hidden shadow-lg">
      {/* Image Gallery with Carousel */}
      <div className="relative h-72 group">
        {/* Main Image */}
        <div 
          className="relative w-full h-full overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
        <img
            src={images?.[currentImageIndex]?.url || 'https://via.placeholder.com/1200x800'}
          alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
        />
          {/* Glowing Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Image Description */}
          <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-base transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
            <p>
              {images?.[currentImageIndex]?.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images?.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs z-10">
          {status}
        </div>

        {/* Edit Button - Moved to top right */}
        {currentUserId === owner_id && (
          <div className="absolute top-2 left-2 z-10">
            <button 
              onClick={handleEditClick}
              className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition-colors flex items-center text-xs"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
        )}

        {/* Image Dots Navigation */}
        {images?.length > 1 && (
          <div className="absolute bottom-2 right-2 flex space-x-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-blue-500 w-3'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image View */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={handleCloseFullscreen}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={images?.[currentImageIndex]?.url}
              alt={title}
              className="max-w-[90%] max-h-[90%] object-contain"
            />
            
            {/* Fullscreen Navigation */}
            {images?.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-4 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
            
            {/* Fullscreen Image Description */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-3 rounded-lg">
              <p className="text-xl">
                {images?.[currentImageIndex]?.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title and Type */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
          <p className="text-gray-400 text-base">{type}</p>
        </div>

        {/* Location */}
        <div className="mb-4">
          <div className="flex items-center text-gray-400 mb-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-base">{`${local_address}, ${district}, ${city}, ${state}`}</span>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-[#282A36] p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Square className="w-4 h-4 mr-1" />
              <span>Area</span>
            </div>
            <p className="text-white text-base">{area} sq ft</p>
          </div>
          <div className="bg-[#282A36] p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Bed className="w-4 h-4 mr-1" />
              <span>Bedrooms</span>
            </div>
            <p className="text-white text-base">{totalFacilities.beds}</p>
          </div>
          <div className="bg-[#282A36] p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Bath className="w-4 h-4 mr-1" />
              <span>Bathrooms</span>
            </div>
            <p className="text-white text-base">{totalFacilities.baths}</p>
          </div>
          <div className="bg-[#282A36] p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Home className="w-4 h-4 mr-1" />
              <span>Halls</span>
            </div>
            <p className="text-white text-base">{totalFacilities.halls}</p>
          </div>
          <div className="bg-[#282A36] p-3 rounded-lg">
            <div className="flex items-center text-gray-400 mb-1">
              <Utensils className="w-4 h-4 mr-1" />
              <span>Kitchens</span>
            </div>
            <p className="text-white text-base">{totalFacilities.kitchens}</p>
          </div>
        </div>

        {/* Floor Details */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center"><Layers className="w-5 h-5 mr-1" /> Floor Details</h2>
          <div className="space-y-2">
            {floors?.map((floor, index) => (
              <div key={index} className="bg-[#282A36] p-3 rounded-lg">
                <h3 className="text-white font-medium mb-1">Floor {floor.floorNo}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-gray-400">Bedrooms</p>
                    <p className="text-white">{floor.bedroomNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Bathrooms</p>
                    <p className="text-white">{floor.bathNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Halls</p>
                    <p className="text-white">{floor.hallNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Kitchens</p>
                    <p className="text-white">{floor.kitchenNo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Information */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center"><Building2 className="w-5 h-5 mr-1" /> Property Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-[#282A36] p-3 rounded-lg">
              <div className="flex items-center text-gray-400 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Built Year</span>
              </div>
              <p className="text-white">{built_year}</p>
            </div>
            <div className="bg-[#282A36] p-3 rounded-lg">
              <div className="flex items-center text-gray-400 mb-1">
                <Building2 className="w-4 h-4 mr-1" />
                <span>Available For</span>
              </div>
              <p className="text-white">{available_for}</p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center"><Sparkles className="w-5 h-5 mr-1" /> Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-base font-medium text-white mb-1">Individual Amenities</h3>
              <div className="bg-[#282A36] p-3 rounded-lg flex flex-wrap gap-2">
                {individual_amenities?.map((amenity, index) => (
                  <span key={index} className="bg-[#1E1F2B] text-white px-2 py-0.5 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium text-white mb-1">Shared Amenities</h3>
              <div className="bg-[#282A36] p-3 rounded-lg flex flex-wrap gap-2">
                {shared_amenities?.map((amenity, index) => (
                  <span key={index} className="bg-[#1E1F2B] text-white px-2 py-0.5 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Neighborhood Information */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center"><BookOpen className="w-5 h-5 mr-1" /> Neighborhood Information</h2>
          <div className="bg-[#282A36] p-3 rounded-lg">
            <p className="text-gray-400 text-sm">{neighborhood_info}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-[#282A36] p-4 rounded-lg mt-6">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center"><IndianRupee className="w-5 h-5 mr-1" /> Pricing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {available_for === 'Rent' && (
              <>
                <div>
                  <p className="text-gray-400">Monthly Rent</p>
                  <p className="text-white text-xl font-semibold">₹{monthly_rent}/month</p>
                </div>
                <div>
                  <p className="text-gray-400">Security Deposit</p>
                  <p className="text-white text-xl font-semibold">₹{security_deposit}</p>
                </div>
              </>
            )}
            {available_for === 'Sell' && (
              <div>
                <p className="text-gray-400">Selling Price</p>
                <p className="text-white text-xl font-semibold">₹{price}</p>
              </div>
            )}
            {available_for === 'Both' && (
              <>
                <div>
                  <p className="text-gray-400">Monthly Rent</p>
                  <p className="text-white text-xl font-semibold">₹{monthly_rent}/month</p>
                </div>
                <div>
                  <p className="text-gray-400">Security Deposit</p>
                  <p className="text-white text-xl font-semibold">₹{security_deposit}</p>
                </div>
                <div>
                  <p className="text-gray-400">Selling Price</p>
                  <p className="text-white text-xl font-semibold">₹{price}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Owner */}
        {(owner_email || owner_phone_number) && (
          <div className="mt-6 bg-[#282A36] p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center"><Phone className="w-5 h-5 mr-1" /> Contact Owner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {owner_email && (
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white"><a href={`mailto:${owner_email}`} className="text-blue-400 hover:underline">{owner_email}</a></p>
                </div>
              )}
              {owner_phone_number && (
                <div>
                  <p className="text-gray-400">Phone Number</p>
                  <p className="text-white"><a href={`tel:${owner_phone_number}`} className="text-blue-400 hover:underline">{owner_phone_number}</a></p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsCard; 
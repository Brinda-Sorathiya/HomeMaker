import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, MapPin, Calendar, Building2, Utensils, Sparkles, BookOpen, IndianRupee, Layers } from 'lucide-react';
import useProperty from '../../../context_store/property_store.js';
import useAuth from '../../../context_store/auth_store.js';
import { uploadMultipleImages } from '../../../lib/cloudinary.js';

const AddPropertyForm = ({ onClose, onSuccess }) => {
  const { amenities, fetchAmenities, addProperty, loading } = useProperty();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [formData, setFormData] = useState({
    // Property table fields
    apn: '', // Will be generated on backend
    builtYear: '',
    status: 'Available',
    mapUrl: '',
    area: '',
    state: '',
    city: '',
    district: '',
    localAddress: '',
    pincode: '',
    neighborhoodInfo: '',
    title: '',
    availableFor: 'Rent',
    type: '',
    tourUrl: '',
    ownerId: user?.id || '',

    // Individual and Shared amenities
    individualAmenities: [],
    sharedAmenities: [],

    // Rent/Sell specific fields
    monthlyRent: '',
    securityDeposit: '',
    price: '',

    // Property Images
    images: [],

    // Add floors array to store floor-specific data
    floors: [{
      floorNo: 1,
      hallNo: 0,
      kitchenNo: 0,
      bathNo: 0,
      bedroomNo: 0
    }]
  });

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(amenity)
        ? prev[type].filter(a => a !== amenity)
        : [...prev[type], amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      description: '',
      id: Math.random().toString(36).substr(2, 9),
      previewUrl: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleImageDescriptionChange = (id, description) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === id ? { ...img, description } : img
      )
    }));
  };

  const handleRemoveImage = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleFloorChange = (floorIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      floors: prev.floors.map((floor, index) => 
        index === floorIndex ? { ...floor, [field]: value } : floor
      )
    }));
  };

  const addFloor = () => {
    setFormData(prev => ({
      ...prev,
      floors: [...prev.floors, {
        floorNo: prev.floors.length + 1,
        hallNo: 0,
        kitchenNo: 0,
        bathNo: 0,
        bedroomNo: 0
      }]
    }));
  };

  const removeFloor = (floorIndex) => {
    setFormData(prev => ({
      ...prev,
      floors: prev.floors.filter((_, index) => index !== floorIndex)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate user is logged in
    if (!user?.id) {
      console.error('User not logged in');
      return;
    }

    try {
      setUploading(true);
      
      // Upload images to Cloudinary first
      const imageFiles = formData.images.map(img => img.file);
      let cloudinaryUrls = [];
      
      try {
        cloudinaryUrls = await uploadMultipleImages(imageFiles);
      } catch (uploadError) {
        console.error('Failed to upload images:', uploadError);
        alert('Failed to upload images. Please try again.');
        setUploading(false);
        return;
      }
      
      // Create the final form data with Cloudinary URLs
      const finalFormData = {
        ...formData,
        ownerId: user.id, // Ensure ownerId is set
        images: formData.images.map((img, index) => ({
          url: cloudinaryUrls[index],
          description: img.description
        }))
      };

      // Remove file objects and preview URLs before sending
      const cleanFormData = {
        ...finalFormData,
        images: finalFormData.images.map(({ url, description }) => ({
          url,
          description
        }))
      };

      // console.log('Submitting property data:', cleanFormData); // Debug log
      await addProperty(cleanFormData);
      onSuccess();
    } catch (error) {
      console.error('Failed to add property:', error);
      alert('Failed to add property. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-16">
      <div className="bg-[#282A36] w-full h-full overflow-y-auto px-5 mx-5 mt-10 mb-14 pb-5">
        <div className="flex justify-between items-center mb-6 pt-4">
          <h2 className="text-2xl font-bold text-white">Add New Property</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Property Information */}
          <div className="mb-6 bg-[#282A36] p-4 rounded-lg  text-white">
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="builtYear"
                placeholder="Built Year"
                value={formData.builtYear}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="area"
                placeholder="Area (sq ft)"
                value={formData.area}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="localAddress"
                placeholder="Local Address"
                value={formData.localAddress}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Property Title"
                value={formData.title}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                name="availableFor"
                value={formData.availableFor}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Rent">Rent</option>
                <option value="Sell">Sell</option>
                <option value="Both">Both</option>
              </select>
              <input
                type="text"
                name="type"
                placeholder="Property Type"
                value={formData.type}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="mapUrl"
                placeholder="Map URL (Optional)"
                value={formData.mapUrl}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="tourUrl"
                placeholder="Virtual Tour URL (Optional)"
                value={formData.tourUrl}
                onChange={handleChange}
                className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Neighborhood Information */}
          <div className="mb-6 bg-[#282A36] p-4 rounded-lg  text-white">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><BookOpen className="w-6 h-6 mr-2" /> Neighborhood Information</h3>
            <div>
              <textarea
                name="neighborhoodInfo"
                placeholder="Neighborhood Information"
                value={formData.neighborhoodInfo}
                onChange={handleChange}
                className="w-full bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
          </div>

          {/* Rent/Sell Specific Fields */}
          {(formData.availableFor === 'Rent' || formData.availableFor === 'Both') && (
            <div className="mb-6 bg-[#282A36] p-4 rounded-lg  text-white">
              <h3 className="text-xl font-semibold mb-4 flex items-center"><IndianRupee className="w-6 h-6 mr-2" /> Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="monthlyRent"
                  placeholder="Monthly Rent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.availableFor === 'Rent' || formData.availableFor === 'Both'}
                />
                <input
                  type="number"
                  name="securityDeposit"
                  placeholder="Security Deposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  className="bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.availableFor === 'Rent' || formData.availableFor === 'Both'}
                />
              </div>
            </div>
          )}

          {(formData.availableFor === 'Sell' || formData.availableFor === 'Both') && (
            <div className="mb-6 bg-[#282A36] p-4 rounded-lg  text-white">
              <h3 className="text-xl font-semibold mb-4 flex items-center"><IndianRupee className="w-6 h-6 mr-2" />Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Selling Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.availableFor === 'Sell' || formData.availableFor === 'Both'}
                />
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="mb-6 bg-[#282A36] p-4 rounded-lg  text-white">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><Sparkles className="w-6 h-6 mr-2" /> Amenities</h3>
            <div className="space-y-4">
              <h4 className="text-gray-400 mb-2">Individual Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.individualAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity, 'individualAmenities')}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>

              <h4 className="text-gray-400 mb-2">Shared Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.sharedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity, 'sharedAmenities')}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Floor Information Section */}
          <div className="mb-6 bg-[#282A36] p-4 rounded-lg  text-white">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><Layers className="w-6 h-6 mr-2" /> Floor Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">Floor Information</h3>
                <button
                  type="button"
                  onClick={addFloor}
                  className="flex items-center space-x-1 text-blue-500 hover:text-blue-400"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Floor</span>
                </button>
              </div>

              {formData.floors.map((floor, index) => (
                <div key={index} className="bg-[#1E1F2B] p-4 rounded-lg space-y-4 border border-gray-600">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium">Floor {floor.floorNo}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeFloor(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Halls</label>
                      <input
                        type="number"
                        min="0"
                        value={floor.hallNo}
                        onChange={(e) => handleFloorChange(index, 'hallNo', parseInt(e.target.value))}
                        className="w-full bg-[#282A36] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Kitchens</label>
                      <input
                        type="number"
                        min="0"
                        value={floor.kitchenNo}
                        onChange={(e) => handleFloorChange(index, 'kitchenNo', parseInt(e.target.value))}
                        className="w-full bg-[#282A36] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={floor.bathNo}
                        onChange={(e) => handleFloorChange(index, 'bathNo', parseInt(e.target.value))}
                        className="w-full bg-[#282A36] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={floor.bedroomNo}
                        onChange={(e) => handleFloorChange(index, 'bedroomNo', parseInt(e.target.value))}
                        className="w-full bg-[#282A36] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Images */}
          <div className="mb-6 bg-[#282A36] p-4 rounded-lg  text-white">
            <h3 className="text-xl font-semibold mb-4 flex items-center">Images</h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="w-full bg-[#1E1F2B] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-gray-400 text-sm">
                  {formData.images.length} images selected
                </span>
              </div>

              {uploading && (
                <div className="text-white text-sm">
                  Uploading images to Cloudinary... Please wait
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.images.map((image) => (
                  <div key={image.id} className="relative bg-[#1E1F2B] rounded-lg p-4 border border-gray-600">
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="aspect-w-16 aspect-h-9 mb-3">
                      <img
                        src={image.previewUrl}
                        alt="Property"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <textarea
                      value={image.description}
                      onChange={(e) => handleImageDescriptionChange(image.id, e.target.value)}
                      placeholder="Add image description..."
                      className="w-full bg-[#282A36] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows="2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading || uploading ? 'Processing...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm; 
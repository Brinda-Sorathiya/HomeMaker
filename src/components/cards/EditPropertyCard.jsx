import React, { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Home, Calendar, Building2, Utensils, Sparkles, BookOpen, IndianRupee, Phone, Layers, Edit, X } from 'lucide-react';
import useProperty from '../../context_store/property_store';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary';

const EditPropertyCard = ({ property, onSave, onCancel }) => {
  const [editableProperty, setEditableProperty] = useState({});
  const [individualAmenitiesInput, setIndividualAmenitiesInput] = useState([]);
  const [sharedAmenitiesInput, setSharedAmenitiesInput] = useState([]);
  const [floorsInput, setFloorsInput] = useState([]);
  const [imagesInput, setImagesInput] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const {amenities} = useProperty();

  useEffect(() => {
    if (property) {
      setEditableProperty({
        ...property,
      });
      setIndividualAmenitiesInput(property.individual_amenities || []);
      setSharedAmenitiesInput(property.shared_amenities || []);
      setFloorsInput(property.floors || []);
      setImagesInput(property.images || []);
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity, type) => {
    if (type === 'individual') {
      setIndividualAmenitiesInput(prev => 
        prev.includes(amenity)
          ? prev.filter(a => a !== amenity)
          : [...prev, amenity]
      );
    } else {
      setSharedAmenitiesInput(prev => 
        prev.includes(amenity)
          ? prev.filter(a => a !== amenity)
          : [...prev, amenity]
      );
    }
  };

  const handleFloorChange = (index, field, value) => {
    const updatedFloors = floorsInput.map((floor, i) =>
      i === index ? { ...floor, [field]: Number(value) } : floor
    );
    setFloorsInput(updatedFloors);
  };

  const handleAddFloor = () => {
    setFloorsInput(prev => [...prev, { floorNo: (prev.length + 1), hallNo: 0, kitchenNo: 0, bathNo: 0, bedroomNo: 0 }]);
  };

  const handleRemoveFloor = (index) => {
    setFloorsInput(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files.map(file => ({
      file,
      description: '',
      preview: URL.createObjectURL(file)
    }))]);
  };

  // Cleanup object URLs when component unmounts or when images are removed
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      newImages.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [newImages]);

  const handleRemoveImage = async (index, isExisting = true) => {
    if (isExisting) {
      const imageToRemove = imagesInput[index];
      setRemovedImages(prev => [...prev, imageToRemove]);
      setImagesInput(prev => prev.filter((_, i) => i !== index));
    } else {
      // Cleanup object URL before removing
      if (newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      setNewImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload new images to Cloudinary
      const uploadedUrls = await Promise.all(
        newImages.map(image => uploadToCloudinary(image.file))
      );

      // Delete removed images from Cloudinary
      await Promise.all(
        removedImages.map(image => deleteFromCloudinary(image.url))
      );

      // Combine existing and new images
      const updatedImages = [
        ...imagesInput,
        ...uploadedUrls.map((url, index) => ({ 
          url, 
          description: newImages[index].description || '' 
        }))
      ];

      const updatedData = {
        ...editableProperty,
        individual_amenities: individualAmenitiesInput,
        shared_amenities: sharedAmenitiesInput,
        floors: floorsInput,
        images: updatedImages,
      };

      // Remove owner contact info from being saved
      delete updatedData.owner_email;
      delete updatedData.owner_phone_number;

      onSave(updatedData);
    } catch (error) {
      console.error('Error handling images:', error);
      // You might want to show an error message to the user here
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#1E1F2B] rounded-lg overflow-hidden shadow-lg p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <Edit className="w-8 h-8 mr-2" /> Edit Property Details
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="mb-6 bg-[#282A36] p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Title</label>
              <input type="text" name="title" value={editableProperty.title || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Type</label>
              <input type="text" name="type" value={editableProperty.type || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Status</label>
              <select name="status" value={editableProperty.status || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600">
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Available For</label>
              <select name="available_for" value={editableProperty.available_for || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600">
                <option value="Rent">Rent</option>
                <option value="Sell">Sell</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Built Year</label>
              <input type="number" name="built_year" value={editableProperty.built_year || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Area (sq ft)</label>
              <input type="number" name="area" value={editableProperty.area || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Tour URL</label>
              <input type="text" name="tour_url" value={editableProperty.tour_url || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Map URL</label>
              <input type="text" name="map_url" value={editableProperty.map_url || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6 bg-[#282A36] p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><MapPin className="w-6 h-6 mr-2" /> Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">State</label>
              <input type="text" name="state" value={editableProperty.state || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">City</label>
              <input type="text" name="city" value={editableProperty.city || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">District</label>
              <input type="text" name="district" value={editableProperty.district || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Local Address</label>
              <input type="text" name="local_address" value={editableProperty.local_address || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Pincode</label>
              <input type="number" name="pincode" value={editableProperty.pincode || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        {(editableProperty.available_for === 'Rent' || editableProperty.available_for === 'Both') && (
          <div className="mb-6 bg-[#282A36] p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><IndianRupee className="w-6 h-6 mr-2" /> Rental Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Monthly Rent</label>
                <input type="number" name="monthly_rent" value={editableProperty.monthly_rent || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Security Deposit</label>
                <input type="number" name="security_deposit" value={editableProperty.security_deposit || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
              </div>
            </div>
          </div>
        )}
        {(editableProperty.available_for === 'Sell' || editableProperty.available_for === 'Both') && (
          <div className="mb-6 bg-[#282A36] p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><IndianRupee className="w-6 h-6 mr-2" /> Sale Details</h3>
            <div>
              <label className="block text-gray-400 mb-1">Selling Price</label>
              <input type="number" name="price" value={editableProperty.price || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600" />
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="mb-6 bg-[#282A36] p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><Sparkles className="w-6 h-6 mr-2" /> Amenities</h3>
          <div className="space-y-4">
            <h4 className="text-gray-400 mb-2">Individual Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {amenities?.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={individualAmenitiesInput.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity, 'individual')}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>

            <h4 className="text-gray-400 mb-2">Shared Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {amenities?.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={sharedAmenitiesInput.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity, 'shared')}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Floor Details */}
        <div className="mb-6 bg-[#282A36] p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><Layers className="w-6 h-6 mr-2" /> Floor Details</h3>
          {floorsInput.map((floor, index) => (
            <div key={index} className="mb-4 p-4 rounded-lg bg-[#1E1F2B] border border-gray-600">
              <h4 className="text-lg font-medium mb-2">Floor {floor.floorNo}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Bedrooms</label>
                  <input type="number" value={floor.bedroomNo || 0} onChange={(e) => handleFloorChange(index, 'bedroomNo', e.target.value)} className="w-full p-2 rounded bg-[#282A36] text-white border border-gray-600" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Bathrooms</label>
                  <input type="number" value={floor.bathNo || 0} onChange={(e) => handleFloorChange(index, 'bathNo', e.target.value)} className="w-full p-2 rounded bg-[#282A36] text-white border border-gray-600" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Halls</label>
                  <input type="number" value={floor.hallNo || 0} onChange={(e) => handleFloorChange(index, 'hallNo', e.target.value)} className="w-full p-2 rounded bg-[#282A36] text-white border border-gray-600" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Kitchens</label>
                  <input type="number" value={floor.kitchenNo || 0} onChange={(e) => handleFloorChange(index, 'kitchenNo', e.target.value)} className="w-full p-2 rounded bg-[#282A36] text-white border border-gray-600" />
                </div>
              </div>
              <button type="button" onClick={() => handleRemoveFloor(index)} className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">Remove Floor</button>
            </div>
          ))}
          <button type="button" onClick={handleAddFloor} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Add Floor</button>
        </div>

        {/* Images */}
        <div className="mb-6 bg-[#282A36] p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center">Images</h3>
          
          {/* Existing Images */}
          {imagesInput.map((image, index) => (
            <div key={`existing-${index}`} className="mb-4 p-4 rounded-lg bg-[#1E1F2B] border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium">Image {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, true)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img src={image.url} alt={`Property ${index + 1}`} className="w-full h-48 object-cover rounded mb-2" />
              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={image.description || ''}
                  onChange={(e) => {
                    const newImages = [...imagesInput];
                    newImages[index] = { ...newImages[index], description: e.target.value };
                    setImagesInput(newImages);
                  }}
                  className="w-full p-2 rounded bg-[#282A36] text-white border border-gray-600"
                />
              </div>
            </div>
          ))}

          {/* New Images Preview */}
          {newImages.map((image, index) => (
            <div key={`new-${index}`} className="mb-4 p-4 rounded-lg bg-[#1E1F2B] border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium">New Image {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, false)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img 
                src={image.preview} 
                alt={`New ${index + 1}`} 
                className="w-full h-48 object-cover rounded mb-2" 
              />
              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={image.description || ''}
                  onChange={(e) => {
                    const newFiles = [...newImages];
                    newFiles[index] = { ...newFiles[index], description: e.target.value };
                    setNewImages(newFiles);
                  }}
                  className="w-full p-2 rounded bg-[#282A36] text-white border border-gray-600"
                />
              </div>
            </div>
          ))}

          {/* Add New Image Button */}
          <div className="mt-4">
            <label className="block text-gray-400 mb-2">Add New Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFileChange}
              className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600"
            />
          </div>
        </div>

        {/* Neighborhood Information */}
        <div className="mb-6 bg-[#282A36] p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><BookOpen className="w-6 h-6 mr-2" /> Neighborhood Information</h3>
          <div>
            <label className="block text-gray-400 mb-1">Neighborhood Info</label>
            <textarea name="neighborhood_info" value={editableProperty.neighborhood_info || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#1E1F2B] text-white border border-gray-600"></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center"
            disabled={uploading}
          >
            {uploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyCard; 
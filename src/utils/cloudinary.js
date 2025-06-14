import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

  try {
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary upload failed:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicUrl) => {
  try {
    // Extract public_id from the URL
    const urlParts = publicUrl.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        public_id: publicId,
        api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
        api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
        timestamp: Math.floor(Date.now() / 1000)
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to delete image from Cloudinary');
    }

    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}; 
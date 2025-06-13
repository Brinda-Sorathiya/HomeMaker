import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailsCard from '../components/cards/DetailsCard';
import useProperty from '../context_store/property_store';

const Insights = () => {
  const { apn } = useParams();
  const navigate = useNavigate();
  const { properties, loading, error, fetchAllProperties } = useProperty();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetchAllProperties();
  }, [fetchAllProperties]);

  useEffect(() => {
    if (properties.length > 0) {
      const foundProperty = properties.find(p => p.apn === apn);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        navigate('/explore');
      }
    }
  }, [properties, apn, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-gray-400">Property not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] p-8">
      <div className="max-w-7xl mx-auto">
        <DetailsCard property={property} />
      </div>
    </div>
  );
};

export default Insights; 
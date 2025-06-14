import React, { useEffect } from 'react';
import DetailsCard from '../components/cards/DetailsCard';
import useProperty from '../context_store/property_store';

const Insights = () => {
  const { currentInsightProperty, loading, error } = useProperty();

  // useEffect(() => {
  //   // If we don't have the current property in the store, fetch all properties
  //   if (!currentInsightProperty) {
  //     fetchAllProperties();
  //   }
  // }, [currentInsightProperty, fetchAllProperties]);

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

  if (!currentInsightProperty) {
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
        <DetailsCard property={currentInsightProperty} />
      </div>
    </div>
  );
};

export default Insights; 
import React, { useEffect } from 'react';
import useRecommendation from '../../context_store/recommendation_store';
import PropertyCard from '../cards/PropertyCard';

const Recomendations = ({ propertyId }) => {
  const {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    clearRecommendations,
  } = useRecommendation();

  useEffect(() => {
    if (propertyId) {
      fetchRecommendations(propertyId);
    } else {
      clearRecommendations();
    }
    // Clear recommendations on unmount or propertyId change
    return () => clearRecommendations();
    // eslint-disable-next-line
  }, [propertyId]);

  return (
    <div className="w-full py-4">
      <h3 className="text-lg text-white font-semibold mb-2">You also should visit</h3>
      {loading && <div className="text-white mb-4">Loading recommendations...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading && !error && (
        <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-[#E94560] scrollbar-track-[#1A1A2E] bg-[#282A36] p-3 rounded-md">
          {recommendations.length === 0 ? (
            <div className="text-gray-400">No recommendations found.</div>
          ) : (
            recommendations.map((property) => (
              <PropertyCard key={property.apn} property={property} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Recomendations;
